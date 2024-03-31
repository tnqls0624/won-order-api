import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteGroupEvent } from 'src/group/domain/event/delete-group.event';
import { GroupRepository } from 'src/group/domain/group.repository';
import { InjectionToken } from '../injection-token';

@EventsHandler(DeleteGroupEvent)
export class DeleteGroupHandler implements IEventHandler<DeleteGroupEvent> {
  constructor(
    @Inject(InjectionToken.GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepository
  ) {}

  async handle(event: DeleteGroupEvent) {
    const { id } = event;
    await this.groupRepository.delete(id);
  }
}
