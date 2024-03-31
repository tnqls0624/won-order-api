import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import CustomError from 'src/common/error/custom-error';
import { InjectionToken } from '../../application/injection-token';
import { OrderTransactionFactory } from 'src/order/domain/order-transaction/order-transaction.factory';
import { OrderTransactionEntity } from '../entity/order-transaction.entity';
import { OrderTransaction, OrderTransactionProperties } from 'src/order/domain/order-transaction/order-transaction';
import { OrderTransactionRepository } from 'src/order/domain/order-transaction/order-transaction.repository';

export class OrderTransactionRepositoryImplement implements OrderTransactionRepository {
  private readonly logger = new Logger(OrderTransactionRepositoryImplement.name);
  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.ORDER_TRANSACTION_FACTORY)
    private readonly orderTransactionFactory: OrderTransactionFactory
  ) {}

  async save(data: OrderTransaction): Promise<OrderTransactionEntity | null> {
    try {
      const entity = this.modelToEntity(data);
      const order = (await this.prisma.order_transaction.create({
        data: entity
      })) as OrderTransactionEntity;
      return order ? order : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async update(id: number, status: number): Promise<boolean> {
    try {
      (await this.prisma.order_transaction.update({
        where: {
          id
        },
        data: {
          status
        }
      })) as OrderTransactionEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async findByTranId(order_num: string): Promise<OrderTransaction | null> {
    try {
      const entity = (await this.prisma.order_transaction.findFirst({
        where: {
          order_num
        }
      })) as OrderTransactionEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: OrderTransaction): OrderTransactionEntity {
    const properties = JSON.parse(
      JSON.stringify(model)
    ) as OrderTransactionProperties;
    return {
      ...properties,
      create_at: properties.create_at,
      update_at: properties.update_at
    };
  }

  private entityToModel(entity: OrderTransactionEntity): OrderTransaction {
    return this.orderTransactionFactory.reconstitute({
      ...entity,
      create_at: entity.create_at,
      update_at: entity.update_at
    });
  }
}
