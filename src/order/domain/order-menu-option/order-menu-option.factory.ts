import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import {
  OrderMenuOption,
  OrderMenuOptionImplement,
  OrderMenuOptionProperties
} from './order-menu-option';

type CreateOrderMenuOptions = Readonly<{
  order_menu_id: number;
  menu_option_id: number;
}>;

export class OrderMenuOptionFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateOrderMenuOptions): OrderMenuOption {
    return this.eventPublisher.mergeObjectContext(
      new OrderMenuOptionImplement({
        ...options,
        create_at: dayjs().toDate(),
        update_at: dayjs().toDate(),
        remove_at: null
      })
    );
  }

  reconstitute(properties: OrderMenuOptionProperties): OrderMenuOption {
    return this.eventPublisher.mergeObjectContext(
      new OrderMenuOptionImplement(properties)
    );
  }
}
