import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import {
  MenuCategory,
  MenuCategoryImplement,
  MenuCategoryProperties
} from './menu-category';

type CreateMenuCategoryOptions = Readonly<{
  market_id: number;
  group_id: number;
  index: number;
  name: string;
  content: string;
}>;

export class MenuCategoryFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateMenuCategoryOptions): MenuCategory {
    return this.eventPublisher.mergeObjectContext(
      new MenuCategoryImplement({
        ...options,
        create_at: dayjs().toDate(),
        update_at: dayjs().toDate(),
        remove_at: null
      })
    );
  }

  reconstitute(properties: MenuCategoryProperties): MenuCategory {
    return this.eventPublisher.mergeObjectContext(
      new MenuCategoryImplement(properties)
    );
  }
}
