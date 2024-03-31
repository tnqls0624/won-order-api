import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import dayjs from 'dayjs';

import { Order, OrderImplement, OrderProperties } from './order';

type CreateOrderOptions = Readonly<{
  main_order_id: number;
  order_num: string;
  total: number;
  request: string;
}>;

export class OrderFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateOrderOptions): Order {
    return this.eventPublisher.mergeObjectContext(
      new OrderImplement({
        ...options,
        create_at: dayjs().toDate(),
        update_at: dayjs().toDate(),
        remove_at: null
      })
    );
  }

  reconstitute(properties: OrderProperties): Order {
    return this.eventPublisher.mergeObjectContext(
      new OrderImplement(properties)
    );
  }
}
