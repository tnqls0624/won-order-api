import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import { OrderMenuStatus } from 'src/order/infrastructure/entity/order-menu.entity';
import {
  OrderMenu,
  OrderMenuImplement,
  OrderMenuProperties
} from './order-menu';

type CreateOrderMenuOptions = Readonly<{
  order_id: number;
  order_group_id: number;
  menu_id: number;
  status: OrderMenuStatus;
  sum: number;
  original_amount: number;
}>;

export class OrderMenuFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateOrderMenuOptions): OrderMenu {
    return this.eventPublisher.mergeObjectContext(
      new OrderMenuImplement({
        ...options,
        create_at: dayjs().toDate(),
        update_at: dayjs().toDate(),
        remove_at: null
      })
    );
  }

  reconstitute(properties: OrderMenuProperties): OrderMenu {
    return this.eventPublisher.mergeObjectContext(
      new OrderMenuImplement(properties)
    );
  }
}
