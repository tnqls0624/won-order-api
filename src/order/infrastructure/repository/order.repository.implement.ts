import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import CustomError from 'src/common/error/custom-error';
import { Order, OrderProperties } from 'src/order/domain/order/order';
import { OrderFactory } from 'src/order/domain/order/order.factory';
import { OrderRepository } from 'src/order/domain/order/order.repository';
import { OrderEntity } from '../entity/order.entity';
import { InjectionToken } from '../../application/injection-token';

export class OrderRepositoryImplement implements OrderRepository {
  private readonly logger = new Logger(OrderRepositoryImplement.name);
  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.ORDER_FACTORY)
    private readonly orderFactory: OrderFactory
  ) {}

  async save(data: Order): Promise<OrderEntity | null> {
    try {
      const entity = this.modelToEntity(data);
      const order = (await this.prisma.order.create({
        data: entity
      })) as OrderEntity;
      return order ? order : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async update(data: Order): Promise<boolean> {
    try {
      const entity = this.modelToEntity(data);
      (await this.prisma.order.update({
        where: {
          id: entity.id
        },
        data: entity
      })) as OrderEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async delete(data: Order): Promise<boolean> {
    try {
      const entity = this.modelToEntity(data);
      (await this.prisma.order.update({
        where: {
          id: entity.id
        },
        data: {
          remove_at: dayjs().toDate()
        }
      })) as OrderEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async findById(id: number): Promise<Order | null> {
    try {
      const entity = (await this.prisma.order.findFirst({
        where: {
          id
        }
      })) as OrderEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: Order): OrderEntity {
    const properties = JSON.parse(JSON.stringify(model)) as OrderProperties;
    return {
      ...properties,
      create_at: properties.create_at,
      remove_at: properties.remove_at
    };
  }

  private entityToModel(entity: OrderEntity): Order {
    return this.orderFactory.reconstitute({
      ...entity,
      create_at: entity.create_at,
      update_at: entity.update_at,
      remove_at: entity.remove_at
    });
  }
}
