import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import CustomError from 'src/common/error/custom-error';
import { OrderQuery } from 'src/order/application/query/order.query';
import { OrderEntity } from '../entity/order.entity';

export class OrderQueryImplement implements OrderQuery {
  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findAll(main_order_id: number): Promise<OrderEntity[] | null> {
    try {
      const entities = (await this.prisma.order.findMany({
        where: {
          main_order_id,
          remove_at: null
        }
      })) as OrderEntity[];
      return entities ? entities : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findByOrderNum(order_num: string): Promise<OrderEntity | null> {
    try {
      const entity = (await this.prisma.order.findFirst({
        where: {
          order_num,
          remove_at: null
        }
      })) as OrderEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private readonly logger = new Logger(OrderQueryImplement.name);
}
