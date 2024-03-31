import { Inject, Logger } from '@nestjs/common';
import { CreateOrderCommand } from './create-order.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaClient } from '@prisma/client';
import { InjectionToken } from '../injection-token';
import {
  INTEGRATION_EVENT_PUBLISHER,
  IntegrationEventPublisher,
  OrderPlaced,
  Topic
} from 'libs/message.module';
import { TableQuery } from 'src/table/application/query/table.query';
import {
  ORDER_VALIDATOR,
  OrderValidationImplement
} from 'libs/order-validation.module';
import { OrderTransactionRepository } from 'src/order/domain/order-transaction/order-transaction.repository';
import { OrderTransactionFactory } from 'src/order/domain/order-transaction/order-transaction.factory';
import { MainOrderTypeEnum, SaveOrderResult } from 'src/types';
import { OrderGroupPaymentType } from 'src/order/infrastructure/entity/order-group-payment.entity';
import CustomError from 'src/common/error/custom-error';
import { CreateOrderDto } from 'src/order/interface/dto/create-order.dto';
import { MainOrderStatus } from 'src/order/infrastructure/entity/main-order.entity';
import { RESULT_CODE } from 'src/constant';
import { MenuStatus } from 'src/menu/infrastructure/entity/menu.entity';
import axios from 'axios';
import crypto from 'crypto';
import dayjs from 'dayjs';

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler
  implements ICommandHandler<CreateOrderCommand>
{
  private readonly logger = new Logger(CreateOrderCommandHandler.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.TABLE_QUERY)
    private readonly tableQuery: TableQuery,
    @Inject(INTEGRATION_EVENT_PUBLISHER)
    private readonly integrationEventPublisher: IntegrationEventPublisher,
    @Inject(ORDER_VALIDATOR)
    private readonly orderValidator: OrderValidationImplement,
    @Inject(InjectionToken.ORDER_TRANSACTION_FACTORY)
    private readonly orderTransactionFactory: OrderTransactionFactory,
    @Inject(InjectionToken.ORDER_TRANSACTION_REPOSITORY)
    private readonly orderTransactionRepository: OrderTransactionRepository
  ) {}

  async execute(command: CreateOrderCommand) {
    try {
      const { body } = command;
      await this.validateOrder(body);

      if (body.type === MainOrderTypeEnum.DELIVERY) {
        await this.handleDeliveryOrder(body);
      }

      return await this.processPayment(body);
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private async validateOrder(body: CreateOrderDto): Promise<void> {
    await this.orderValidator.validation(
      body.order_groups.map((order_group) => order_group.group_id)
    );

    if (body.type === MainOrderTypeEnum.HALL) {
      if (!body.table_id) throw new CustomError(RESULT_CODE.NOT_FOUND_TABLE);

      const table_data = await this.tableQuery.findById(body.table_id);
      if (!table_data)
        throw new CustomError(RESULT_CODE.NOT_FOUND_TABLE, {
          data: { table_id: body.table_id }
        });
      await this.orderValidator.validation([table_data.group_id]);

      const table_info = await this.prisma.table.findFirst({
        where: { id: body.table_id },
        include: {
          main_order: {
            where: {
              status: { in: [MainOrderStatus.WAIT, MainOrderStatus.PROGRESS] }
            }
          }
        }
      });

      if (!table_info) throw new CustomError(RESULT_CODE.NOT_FOUND_TABLE);
      if (body.table_code !== table_data.code)
        throw new CustomError(RESULT_CODE.FAIL_TO_VALIDATE_TABLE_CODE);
    }

    const current_menus = await this.prisma.menu.findMany({
      where: {
        id: {
          in: body.order_groups.flatMap((group) =>
            group.menus.map((menu) => menu.menu_id)
          )
        }
      }
    });

    for (const menu of current_menus) {
      if (
        menu.status === MenuStatus.SOLD_OUT ||
        menu.status === MenuStatus.BLIND
      ) {
        throw new CustomError(RESULT_CODE.NOT_ORDER, {
          data: { menu_id: menu.id }
        });
      }
    }
  }

  private async handleDeliveryOrder(body: CreateOrderDto): Promise<void> {
    const existing_address = await this.prisma.addr_list.findFirst({
      where: { address: body.delivery_addr }
    });

    if (!existing_address && body.delivery_addr) {
      const address_data = {
        phone: body.phone,
        address: body.delivery_addr,
        ...(body.user_id && { user_id: Number(body.user_id) }),
        ...(body.guest_id && { guest_id: body.guest_id })
      };

      const condition = {
        where: {
          ...(body.user_id && { user_id: Number(body.user_id) }),
          ...(body.guest_id && { guest_id: body.guest_id }),
          is_active: true
        }
      };

      const active_address = await this.prisma.addr_list.findFirst(condition);

      await this.prisma.addr_list.create({
        data: {
          ...address_data,
          is_active: !active_address
        }
      });
    }

    if (existing_address) {
      await this.prisma.addr_list.update({
        where: {
          id: existing_address.id
        },
        data: {
          update_at: dayjs().toDate()
        }
      });
    }
  }

  private async publishOrderToSNS(
    order: CreateOrderDto
  ): Promise<SaveOrderResult> {
    await this.integrationEventPublisher.publish(
      Topic.ORDER_PLACED,
      new OrderPlaced(JSON.stringify(order))
    );
    return { result: 'PUBLISHED' };
  }

  private async processPayment(body: CreateOrderDto): Promise<any> {
    if (body.pay_type === OrderGroupPaymentType.ON_SITE_PAYMENT) {
      // 현장 결제의 경우 처리 로직
      return this.publishOrderToSNS(body);
    } else {
      // 온라인 결제 처리
      const paymentResult = await this.handleOnlinePayment(body);
      return paymentResult;
    }
  }

  private async handleOnlinePayment(body: CreateOrderDto) {
    // 카드, ABA
    const main_order_num = this.generateUniqueOrderNumber(body.market_id, 'MO');
    const order_num = this.generateUniqueOrderNumber(body.market_id, 'O');
    const custom_body = {
      ...body,
      main_order_num,
      order_num
    };
    const order_transaction = this.orderTransactionFactory.create({
      main_order_num,
      order_num,
      data: JSON.parse(JSON.stringify(custom_body)),
      status: 0,
      pay_type: body.pay_type
    });
    if (!order_transaction) throw new CustomError(RESULT_CODE.NOT_CREATE_ERROR);

    await this.orderTransactionRepository.save(order_transaction);

    const req_time = dayjs().format('YYYYMMDDHHmmss');
    const merchant_id = process.env.ABA_MERCHANT_ID as string;
    const tran_id = order_num;
    const phone = body.phone;
    let amount = 0;
    const type = 'purchase';
    const currency = 'USD';
    const cancel_url = `${process.env.WEB}/market/${body.market_id}`;
    const continue_success_url = `${process.env.WEB}/market/${body.market_id}`;
    let payment_option = 'cards';
    const aba_public_key = process.env.ABA_PUBLIC_KEY as string;
    const aba_url = process.env.ABA_URL as string;
    const view_type = 'hosted_view';
    const items: any[] = [];

    switch (body.pay_type) {
      case OrderGroupPaymentType.ABA_CREDIT_CARD:
        payment_option = 'cards';
        break;
      case OrderGroupPaymentType.ABA_APP_PAYMENT:
        payment_option = 'abapay_deeplink';
        break;
    }
    await Promise.all(
      body.order_groups.map(async (order_group) => {
        let final_total = 0;
        await Promise.all(
          order_group.menus.map(async (menu) => {
            const menu_entity = await this.prisma.menu.findFirst({
              where: {
                id: menu.menu_id
              },
              include: {
                menu_tl: {
                  select: {
                    name: true
                  },
                  where: {
                    language_id: 3
                  }
                }
              }
            });
            const menu_total = (menu_entity?.amount as number) * menu.quantity;
            let option_total = 0;
            await Promise.all(
              menu.menu_options.map(async (option_id) => {
                const option_entity = await this.prisma.menu_option.findFirst({
                  where: {
                    id: option_id
                  }
                });
                option_total += option_entity?.amount as number;
              })
            );
            final_total = menu_total + option_total;
            amount += final_total;
            items.push({
              name: menu_entity?.menu_tl[0].name as string,
              quantity: menu.quantity as number,
              price: final_total
            });
          })
        );
      })
    );

    const items_base64 = Buffer.from(JSON.stringify(items)).toString('base64');
    const return_url = btoa(
      `https://${process.env.MODE}-api.order-planet.com/order/transaction/aba/push-back`
    );
    const base_str =
      req_time +
      merchant_id +
      tran_id +
      amount +
      items_base64 +
      phone +
      type +
      payment_option +
      return_url +
      cancel_url +
      continue_success_url +
      currency;

    const hash = crypto
      .createHmac('sha512', aba_public_key)
      .update(base_str)
      .digest('base64');
    const frm = new FormData();

    frm.append('req_time', req_time);
    frm.append('merchant_id', merchant_id);
    frm.append('tran_id', tran_id);
    frm.append('amount', amount.toString());
    frm.append('items', items_base64);
    frm.append('phone', phone);
    frm.append('type', type);
    frm.append('payment_option', payment_option);
    frm.append('return_url', return_url);
    frm.append('cancel_url', cancel_url);
    frm.append('continue_success_url', continue_success_url);
    frm.append('currency', currency);
    frm.append('view_type', view_type);
    frm.append('hash', hash);
    const aba_res = await axios.post(
      `${aba_url}/api/payment-gateway/v1/payments/purchase`,
      frm,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    const result_url =
      body.pay_type === OrderGroupPaymentType.ABA_CREDIT_CARD
        ? aba_res.request.res.responseUrl
        : body.pay_type === OrderGroupPaymentType.ABA_APP_PAYMENT
        ? {
            abapay_deeplink: aba_res.data.abapay_deeplink,
            app_store: aba_res.data.app_store,
            play_store: aba_res.data.play_store
          }
        : 'type error';

    return result_url;
  }

  private async createOrUpdateAddress(body: CreateOrderDto): Promise<void> {
    const data = {
      phone: body.phone,
      address: body.delivery_addr ?? '',
      ...(body.user_id
        ? { user_id: body.user_id }
        : { guest_id: body.guest_id })
    };
    await this.prisma.addr_list.create({ data });
  }

  private generateUniqueOrderNumber(market_id: number, prefix: string) {
    // MarketID를 문자열로 변환하고 그 길이를 구함
    const market_id_str = market_id.toString();
    const market_id_length = market_id_str.length;
    // MarketID의 길이에 따라 남은 자리수 계산 (총 길이가 10자리가 되어야 함)
    const remaining_length = 14 - market_id_length;
    // 랜덤 부분 생성
    let random_part = '';
    for (let i = 0; i < remaining_length; i++) {
      random_part += Math.floor(Math.random() * 10).toString(); // 0에서 9 사이의 랜덤 숫자
    }
    // 전체 주문 번호 생성
    const tran_iD = `${prefix}-${market_id_str}${random_part}`;
    return tran_iD;
  }
}
