import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRepository } from 'src/auth/domain/user.repository';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { RecoveryUserEvent } from 'src/auth/domain/event/recovery-user.event';

@EventsHandler(RecoveryUserEvent)
export class RecoveryUserEventHandler
  implements IEventHandler<RecoveryUserEvent>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  async handle(event: RecoveryUserEvent) {
    const { id } = event;
    await this.userRepository.recovery(id);
  }
}
