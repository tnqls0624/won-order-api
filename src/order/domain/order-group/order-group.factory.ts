import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import {
  OrderGroup,
  OrderGroupImplement,
  OrderGroupProperties
} from './order-group';

type CreateOrderGroupOptions = Readonly<{
  order_id: number;
  group_id: number;
  total: number;
  request: string;
}>;

export class OrderGroupFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateOrderGroupOptions): OrderGroup {
    return this.eventPublisher.mergeObjectContext(
      new OrderGroupImplement({
        ...options,
        create_at: new Date(),
        update_at: new Date()
      })
    );
  }

  reconstitute(properties: OrderGroupProperties): OrderGroup {
    return this.eventPublisher.mergeObjectContext(
      new OrderGroupImplement(properties)
    );
  }
}
