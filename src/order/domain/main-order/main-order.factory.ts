import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import { MainOrderStatus } from 'src/order/infrastructure/entity/main-order.entity';
import { MainOrderTypeEnum } from 'src/types';
import {
  MainOrder,
  MainOrderImplement,
  MainOrderProperties
} from './main-order';

type CreateMainOrderOptions = Readonly<{
  market_id: number;
  user_id?: number;
  guest_id?: string;
  order_num: string;
  status: MainOrderStatus;
  total: number;
  type: MainOrderTypeEnum;
}>;

export class MainOrderFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateMainOrderOptions): MainOrder {
    return this.eventPublisher.mergeObjectContext(
      new MainOrderImplement({
        ...options,
        create_at: dayjs().toDate(),
        update_at: dayjs().toDate(),
        remove_at: null
      })
    );
  }

  reconstitute(properties: MainOrderProperties): MainOrder {
    return this.eventPublisher.mergeObjectContext(
      new MainOrderImplement(properties)
    );
  }
}
