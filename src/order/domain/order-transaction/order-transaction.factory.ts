import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import {
  OrderTransaction,
  OrderTransactionImplement,
  OrderTransactionProperties
} from './order-transaction';
import { OrderGroupPaymentType } from 'src/order/infrastructure/entity/order-group-payment.entity';

type CreateOrderTransaction = Readonly<{
  main_order_num: string;
  order_num: string;
  data: object;
  pay_type: OrderGroupPaymentType;
  status: number;
}>;

export class OrderTransactionFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateOrderTransaction): OrderTransaction {
    return this.eventPublisher.mergeObjectContext(
      new OrderTransactionImplement({
        ...options,
        create_at: dayjs().toDate(),
        update_at: dayjs().toDate()
      })
    );
  }

  reconstitute(properties: OrderTransactionProperties): OrderTransaction {
    return this.eventPublisher.mergeObjectContext(
      new OrderTransactionImplement(properties)
    );
  }
}
