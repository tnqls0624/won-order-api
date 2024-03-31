import { Inject, Logger } from '@nestjs/common';
import { MainOrderStatus, PrismaClient } from '@prisma/client';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { EventGateway } from 'src/event/gateway/event.gateway';
import {
  OrderGroupPayment,
  OrderGroupPaymentProperties
} from 'src/order/domain/order-group-payment/order-group-payment';
import { OrderGroupPaymentFactory } from 'src/order/domain/order-group-payment/order-group-payment.factory';
import { OrderGroupPaymentRepository } from 'src/order/domain/order-group-payment/order-group-payment.repository';
import {
  OrderGroupPaymentEntity,
  OrderGroupPaymentStatus
} from '../entity/order-group-payment.entity';
import { InjectionToken } from '../../application/injection-token';

export class OrderGroupPaymentRepositoryImplement
  implements OrderGroupPaymentRepository
{
  private readonly logger = new Logger(
    OrderGroupPaymentRepositoryImplement.name
  );

  constructor(
    @Inject('PRISMA_CLIENT') private prisma: PrismaClient,
    private readonly eventGateway: EventGateway,
    @Inject(InjectionToken.ORDER_GROUP_PAYMENT_FACTORY)
    private readonly orderGroupPaymentFactory: OrderGroupPaymentFactory
  ) {}

  async save(data: OrderGroupPayment): Promise<OrderGroupPaymentEntity | null> {
    try {
      const entity = this.modelToEntity(data);
      const order = (await this.prisma.order_group_payment.create({
        data: entity
      })) as OrderGroupPaymentEntity;
      return order ? order : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async updates(
    ids: number[],
    main_order_id: number,
    status: OrderGroupPaymentStatus
  ): Promise<boolean> {
    try {
      this.prisma.$transaction(async (tx) => {
        await tx.order_group_payment.updateMany({
          where: {
            id: {
              in: ids
            }
          },
          data: {
            status
          }
        });

        const paid_order_groups_count = await tx.order_group_payment.count({
          where: {
            main_order_id,
            status: OrderGroupPaymentStatus.PAID
          }
        });
        const order_group_payment_count = await tx.order_group_payment.count({
          where: {
            main_order_id
          }
        });
        if (order_group_payment_count === paid_order_groups_count) {
          await tx.main_order.update({
            where: {
              id: main_order_id
            },
            data: {
              status: MainOrderStatus.COMPLETE
            }
          });

          const main_order = await this.prisma.main_order.findFirst({
            where: {
              id: main_order_id
            }
          });
          if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);
          const message: any = {
            type: 'MAIN_ORDER',
            main_order_id,
            market_id: main_order.market_id,
            status: MainOrderStatus.COMPLETE
          };

          this.eventGateway.employeeOrderUpdateEvent(message);
          this.eventGateway.masterOrderUpdateEvent(message);

          if (main_order.guest_id) message.guest_id = main_order.guest_id;

          if (main_order.user_id) message.user_id = main_order.user_id;

          this.eventGateway.customerOrderUpdateEvent(message);
        }
      });

      return true; // 결과 반환
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async delete(data: OrderGroupPayment): Promise<boolean> {
    try {
      const entity = this.modelToEntity(data);
      (await this.prisma.order_group_payment.delete({
        where: {
          id: entity.id
        }
      })) as OrderGroupPaymentEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async findById(id: number): Promise<OrderGroupPayment | null> {
    try {
      const entity = (await this.prisma.order_group_payment.findFirst({
        where: {
          id
        }
      })) as OrderGroupPaymentEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findAllByIds(ids: number[]): Promise<OrderGroupPayment[] | null> {
    try {
      const entities = (await this.prisma.order_group_payment.findMany({
        where: {
          id: {
            in: ids
          }
        }
      })) as OrderGroupPaymentEntity[];
      return entities
        ? entities.map((entity) => this.entityToModel(entity))
        : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: OrderGroupPayment): OrderGroupPaymentEntity {
    const properties = JSON.parse(
      JSON.stringify(model)
    ) as OrderGroupPaymentProperties;
    return {
      ...properties,
      create_at: properties.create_at,
      update_at: properties.update_at
    };
  }

  private entityToModel(entity: OrderGroupPaymentEntity): OrderGroupPayment {
    return this.orderGroupPaymentFactory.reconstitute({
      ...entity,
      create_at: entity.create_at,
      update_at: entity.update_at
    });
  }
}
