import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateGroupEvent } from 'src/group/domain/event/update-group.event';
import { GroupRepository } from 'src/group/domain/group.repository';
import { InjectionToken } from '../injection-token';

@EventsHandler(UpdateGroupEvent)
export class UpdateGroupHandler implements IEventHandler<UpdateGroupEvent> {
  constructor(
    @Inject(InjectionToken.GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepository
  ) {}

  async handle(event: UpdateGroupEvent) {
    const { id, market_id, name, content } = event;
    await this.groupRepository.update(id, market_id, name, content);
  }
}
