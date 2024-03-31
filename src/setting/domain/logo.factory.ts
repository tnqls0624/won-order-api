import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import { Logo, LogoImplement, LogoProperties } from './logo';

type CreateLogoOptions = Readonly<{
  setting_id: number;
  hash: string;
  w120: string;
  w360: string;
}>;

export class LogoFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateLogoOptions): Logo {
    return this.eventPublisher.mergeObjectContext(
      new LogoImplement({
        ...options,
        create_at: dayjs().toDate(),
        update_at: dayjs().toDate()
      })
    );
  }

  reconstitute(properties: LogoProperties): Logo {
    return this.eventPublisher.mergeObjectContext(
      new LogoImplement(properties)
    );
  }
}
