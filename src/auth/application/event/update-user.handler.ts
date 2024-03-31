import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateUserEvent } from 'src/auth/domain/event/update-user.event';
import { UserRepository } from 'src/auth/domain/user.repository';
import { InjectionToken } from 'src/auth/application/Injection-token';

@EventsHandler(UpdateUserEvent)
export class UpdateUserHandler implements IEventHandler<UpdateUserEvent> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  async handle(event: UpdateUserEvent) {
    const { id, body } = event;
    await this.userRepository.update(id, body);
  }
}
