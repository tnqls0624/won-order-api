import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Notice, NoticeImplement, NoticeProperties } from './notice';

type CreateNoticeOptions = Readonly<{
  writer: number;
  group_id: number;
  title: string;
  content: string;
  index: number;
}>;

export class NoticeFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateNoticeOptions): Notice {
    return this.eventPublisher.mergeObjectContext(
      new NoticeImplement({
        ...options,
        is_active: false,
        remove_at: null,
        create_at: new Date(),
        update_at: new Date()
      })
    );
  }

  reconstitute(properties: NoticeProperties): Notice {
    return this.eventPublisher.mergeObjectContext(
      new NoticeImplement(properties)
    );
  }
}
