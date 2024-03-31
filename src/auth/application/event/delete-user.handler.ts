import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRepository } from 'src/auth/domain/user.repository';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { DeleteUserEvent } from '../../domain/event/delete-user.event';

@EventsHandler(DeleteUserEvent)
export class DeleteUserHandler implements IEventHandler<DeleteUserEvent> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  async handle(event: DeleteUserEvent) {
    const { id } = event;
    await this.userRepository.delete(id);
  }
}
