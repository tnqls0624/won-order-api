import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { AdminType } from 'src/types/login.type';
import { Admin, AdminImplement, AdminProperties } from './admin';

type CreateAdminOptions = Readonly<{
  market_id: number | null;
  type: AdminType;
  admin_id: string;
  language_id: number;
  password: string;
  nickname: string;
}>;

export class AdminFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateAdminOptions): Admin {
    return this.eventPublisher.mergeObjectContext(
      new AdminImplement({
        ...options,
        create_at: new Date(),
        update_at: new Date(),
        remove_at: null
      })
    );
  }

  reconstitute(properties: AdminProperties): Admin {
    return this.eventPublisher.mergeObjectContext(
      new AdminImplement(properties)
    );
  }
}
