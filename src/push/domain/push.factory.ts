import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import { UserPushTokenPlatformType } from '../infrastructure/entity/push.entity';
import { Push, PushImplement, PushProperties } from './push';

type CreatePushOptions = Readonly<{
  user_id: number;
  serial: string;
  token: string;
  platform: UserPushTokenPlatformType;
}>;

export class PushFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreatePushOptions): Push {
    return this.eventPublisher.mergeObjectContext(
      new PushImplement({
        ...options,
        create_at: dayjs().toDate(),
        update_at: dayjs().toDate(),
        remove_at: null
      })
    );
  }

  reconstitute(properties: PushProperties): Push {
    return this.eventPublisher.mergeObjectContext(
      new PushImplement(properties)
    );
  }
}
