import { Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { OrderGroupPaymentQuery } from 'src/order/application/query/order-group-payment.query';
import { OrderGroupPaymentEntity } from '../entity/order-group-payment.entity';

export class OrderGroupPaymentQueryImplement implements OrderGroupPaymentQuery {
  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findByOrderIdWithGroupId(
    main_order_id: number,
    group_id: number
  ): Promise<OrderGroupPaymentEntity | null> {
    const entity = (await this.prisma.order_group_payment.findFirst({
      where: {
        main_order_id,
        group_id
      }
    })) as OrderGroupPaymentEntity;
    return entity;
  }
}
