import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import CustomError from 'src/common/error/custom-error';
import {
  OrderGroup,
  OrderGroupProperties
} from 'src/order/domain/order-group/order-group';
import { OrderGroupFactory } from 'src/order/domain/order-group/order-group.factory';
import { OrderGroupRepository } from 'src/order/domain/order-group/order-group.repository';
import { UpdateOrderGroupDto } from 'src/order/interface/dto/update-order.dto';
import { OrderGroupEntity } from '../entity/order-group.entity';
import { InjectionToken } from '../../application/injection-token';

export class OrderGroupRepositoryImplement implements OrderGroupRepository {
  private readonly logger = new Logger(OrderGroupRepositoryImplement.name);
  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.ORDER_GROUP_FACTORY)
    private readonly orderGroupFactory: OrderGroupFactory
  ) {}

  async save(data: OrderGroup): Promise<OrderGroupEntity | null> {
    try {
      const entity = this.modelToEntity(data);
      const order = (await this.prisma.order_group.create({
        data: entity
      })) as OrderGroupEntity;
      return order ? order : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async update(id: number, body: UpdateOrderGroupDto): Promise<boolean> {
    try {
      await this.prisma.order_group.update({
        where: {
          id
        },
        data: body
      });
      return true; // 결과 반환
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async delete(data: OrderGroup): Promise<boolean> {
    try {
      const entity = this.modelToEntity(data);
      (await this.prisma.order_group.delete({
        where: {
          id: entity.id
        }
      })) as OrderGroupEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async findById(id: number): Promise<OrderGroup | null> {
    try {
      const entity = (await this.prisma.order_group.findFirst({
        where: {
          id
        }
      })) as OrderGroupEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findAllByIds(ids: number[]): Promise<OrderGroup[] | null> {
    try {
      const entities = (await this.prisma.order_group.findMany({
        where: {
          id: {
            in: ids
          }
        }
      })) as OrderGroupEntity[];
      return entities
        ? entities.map((entity) => this.entityToModel(entity))
        : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: OrderGroup): OrderGroupEntity {
    const properties = JSON.parse(
      JSON.stringify(model)
    ) as OrderGroupProperties;
    return {
      ...properties,
      create_at: properties.create_at,
      update_at: properties.update_at
    };
  }

  private entityToModel(entity: OrderGroupEntity): OrderGroup {
    return this.orderGroupFactory.reconstitute({
      ...entity,
      create_at: entity.create_at,
      update_at: entity.update_at
    });
  }
}
