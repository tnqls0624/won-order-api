import { EventPublisher } from '@nestjs/cqrs';
import { User, UserImplement, UserProperties } from 'src/auth/domain/user';
import { Provider } from '../../types/login.type';
import { Inject } from '@nestjs/common';

type CreateUserOptions = Readonly<{
  provider: Provider;
  token: string;
  nickname: string;
}>;

export class UserFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateUserOptions): User {
    return this.eventPublisher.mergeObjectContext(
      new UserImplement({
        ...options,
        create_at: new Date(),
        update_at: new Date(),
        remove_at: null
      })
    );
  }

  reconstitute(properties: UserProperties): User {
    return this.eventPublisher.mergeObjectContext(
      new UserImplement(properties)
    );
  }
}
