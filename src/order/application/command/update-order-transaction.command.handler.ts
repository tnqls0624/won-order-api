import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { InjectionToken } from '../injection-token';
import { UpdateOrderTransactionCommand } from './update-order-transaction.command';
import { OrderTransactionRepository } from 'src/order/domain/order-transaction/order-transaction.repository';
import {
  MainOrderEntity,
  MainOrderStatus
} from 'src/order/infrastructure/entity/main-order.entity';
import { MainOrderTypeEnum, SaveOrderResult } from 'src/types';
import { PrismaClient } from '@prisma/client';
import { MainOrderQuery } from '../query/main-order.query';
import { MenuEntity } from 'src/menu/infrastructure/entity/menu.entity';
import { MenuOptionEntity } from 'src/menu/infrastructure/entity/menu-option.entity';
import {
  OrderGroupPaymentEntity,
  OrderGroupPaymentStatus
} from 'src/order/infrastructure/entity/order-group-payment.entity';
import { OrderMenuStatus } from 'src/order/infrastructure/entity/order-menu.entity';
import {
  INTEGRATION_EVENT_PUBLISHER,
  IntegrationEventPublisher,
  OrderPlaced,
  Topic
} from 'libs/message.module';

@CommandHandler(UpdateOrderTransactionCommand)
export class UpdateOrderTransactionCommandHandler
  implements ICommandHandler<UpdateOrderTransactionCommand>
{
  private readonly logger = new Logger(
    UpdateOrderTransactionCommandHandler.name
  );

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.ORDER_TRANSACTION_REPOSITORY)
    private readonly orderTransactionRepository: OrderTransactionRepository,
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    private readonly mainOrderQuery: MainOrderQuery,
    @Inject(INTEGRATION_EVENT_PUBLISHER)
    private readonly integrationEventPublisher: IntegrationEventPublisher
  ) {}

  async execute(command: UpdateOrderTransactionCommand) {
    try {
      const { body } = command;
      const { tran_id, status } = body;
      const order_transaction =
        await this.orderTransactionRepository.findByTranId(tran_id);
      if (!order_transaction)
        throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER_TRANSACTION);
      order_transaction.updateOrder(Number(status));
      const order = order_transaction.get();
      await this.integrationEventPublisher.publish(
        Topic.ORDER_PLACED,
        new OrderPlaced(JSON.stringify(order.data))
      );
      return { result: 'PUBLISHED' };
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async createOrder(order: any): Promise<MainOrderEntity> {
    if (!order.user_id && !order.guest_id)
      throw new CustomError(RESULT_CODE.USER_ID_OR_GUEST_ID_IS_REQUERE);

    let main_order: MainOrderEntity | undefined;
    if (order.type === MainOrderTypeEnum.HALL) {
      if (order.user_id) {
        main_order = await this.mainOrderQuery.findByOrderPossibleUser(
          order.table_id as number,
          order.user_id as number,
          order.type
        );
      } else {
        main_order = await this.mainOrderQuery.findByOrderPossibleGuest(
          order.table_id as number,
          order.guest_id as string,
          order.type
        );
      }
    }

    const setting = await this.prisma.setting.findFirst({
      where: {
        market_id: order.market_id
      },
      include: {
        market: {
          include: {
            currency: true
          }
        }
      }
    });

    if (!main_order) {
      const main_order_model = {
        market_id: order.market_id,
        user_id: order.user_id,
        table_id: order.table_id,
        guest_id: order.guest_id,
        type: order.type,
        order_num: this.generateUniqueOrderNumber(order.market_id, 'MO'),
        status: MainOrderStatus.WAIT,
        total: 0,
        delivery_addr: order.delivery_addr,
        currency_code: setting?.market?.currency?.code || 'USD'
      };

      main_order = (await this.prisma.main_order.create({
        data: main_order_model,
        include: {
          user: true
        }
      })) as MainOrderEntity;
    }

    const order_entity = await this.prisma.order.create({
      data: {
        main_order_id: main_order?.id as number,
        order_num: this.generateUniqueOrderNumber(main_order.market_id, 'O'),
        total: 0
      }
    });

    let order_total = 0;

    for (const order_group_dto of order.order_groups) {
      let group_total = 0;

      const order_group_entity = await this.prisma.order_group.create({
        data: {
          group_id: order_group_dto.group_id,
          order_id: order_entity.id,
          main_order_id: main_order?.id,
          request: order_group_dto.request
        }
      });

      for (const menu of order_group_dto.menus) {
        const m = (await this.prisma.menu.findFirst({
          where: {
            id: menu.menu_id
          }
        })) as MenuEntity;

        const menu_total = await this.processMenuSync(m, menu.menu_options);
        const final_menu_total = menu_total * menu.quantity;
        group_total += final_menu_total;

        const order_menu_entity = await this.prisma.order_menu.create({
          data: {
            order_id: order_entity.id,
            menu_id: menu.menu_id,
            order_group_id: order_group_entity.id,
            status: OrderMenuStatus.WAIT,
            sum: menu_total * menu.quantity,
            original_amount: m.amount,
            quantity: menu.quantity
          }
        });

        for (const menu_option_id of menu.menu_options) {
          const mo = await this.prisma.menu_option.findFirst({
            where: {
              id: menu_option_id
            }
          });
          await this.prisma.order_menu_option.create({
            data: {
              order_menu_id: order_menu_entity.id,
              menu_option_id,
              original_amount: mo?.amount
            }
          });
        }

        const order_group_payment_entity =
          await this.prisma.order_group_payment.findFirst({
            where: {
              main_order_id: main_order?.id,
              group_id: order_group_dto.group_id
            }
          });
        if (!order_group_payment_entity) {
          (await this.prisma.order_group_payment.create({
            data: {
              main_order_id: main_order?.id as number,
              group_id: order_group_dto.group_id,
              status: OrderGroupPaymentStatus.NOT_PAID,
              total: group_total
            }
          })) as OrderGroupPaymentEntity;
        } else {
          const new_total = order_group_payment_entity.total + group_total;
          await this.prisma.order_group_payment.update({
            where: {
              id: order_group_payment_entity.id
            },
            data: {
              total: new_total
            }
          });
        }

        order_total += group_total;
      }

      await this.prisma.order.update({
        where: {
          id: order_entity.id
        },
        data: {
          total: order_total
        }
      });
    }

    const main_order_total = await this.computeTotalForMainOrderSync(
      main_order?.id as number
    );

    await this.prisma.main_order.update({
      where: {
        id: main_order?.id
      },
      data: {
        total: main_order_total
      }
    });

    return main_order;
  }

  private async processMenuSync(menu: MenuEntity, menu_options: number[]) {
    const menu_option_data = await this.fetchOptions(menu_options);
    return this.computeOrderMenuSum(menu, menu_option_data);
  }

  private async fetchOptions(option_ids: number[]) {
    const options: MenuOptionEntity[] = await this.prisma.menu_option.findMany({
      where: {
        id: {
          in: option_ids
        }
      }
    });
    return options;
  }

  private computeOrderMenuSum(
    menu: { amount: number },
    options: MenuOptionEntity[]
  ) {
    let total = menu.amount;
    for (const option of options) {
      total += option.amount;
    }
    return total;
  }

  private async computeTotalForMainOrderSync(main_order_id: number) {
    let total = 0;
    const order_entities = await this.prisma.order.findMany({
      where: {
        main_order_id
      }
    });

    for (const order_entity of order_entities) {
      total += order_entity.total;
    }
    return total;
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

  /* 주문정보 생성용 SNS Publisher 메소드. 실제 주문 정보 생성은 SNS -> SQS -> 람다함수에서 수행된다 */
  async createOrderToSNS(order: object): Promise<SaveOrderResult> {
    /* AWS SNS에 전송 */
    await this.integrationEventPublisher.publish(
      Topic.ORDER_PLACED,
      new OrderPlaced(JSON.stringify(order))
    );
    return { result: 'PUBLISHED' };
  }
}
