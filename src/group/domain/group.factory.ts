import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import { Group, GroupImplement, GroupProperties } from './group';

type CreateUserOptions = Readonly<{
  market_id: number;
  name: string;
  content: string;
}>;

export class GroupFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateUserOptions): Group {
    return this.eventPublisher.mergeObjectContext(
      new GroupImplement({
        ...options,
        create_at: dayjs().toDate(),
        update_at: dayjs().toDate(),
        remove_at: null
      })
    );
  }

  reconstitute(properties: GroupProperties): Group {
    return this.eventPublisher.mergeObjectContext(
      new GroupImplement(properties)
    );
  }
}
