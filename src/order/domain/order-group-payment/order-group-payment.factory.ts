import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { OrderGroupPaymentStatus } from 'src/order/infrastructure/entity/order-group-payment.entity';
import {
  OrderGroupPayment,
  OrderGroupPaymentImplement,
  OrderGroupPaymentProperties
} from './order-group-payment';

type CreateOrderGroupPaymentOptions = Readonly<{
  main_order_id: number;
  group_id: number;
  status: OrderGroupPaymentStatus;
  total: number;
}>;

export class OrderGroupPaymentFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateOrderGroupPaymentOptions): OrderGroupPayment {
    return this.eventPublisher.mergeObjectContext(
      new OrderGroupPaymentImplement({
        ...options,
        create_at: new Date(),
        update_at: new Date()
      })
    );
  }

  reconstitute(properties: OrderGroupPaymentProperties): OrderGroupPayment {
    return this.eventPublisher.mergeObjectContext(
      new OrderGroupPaymentImplement(properties)
    );
  }
}
