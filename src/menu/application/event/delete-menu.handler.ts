import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteMenuEvent } from 'src/menu/domain/event/delete-menu.event';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { InjectionToken } from '../Injection-token';

@EventsHandler(DeleteMenuEvent)
export class DeleteMenuEventHandler implements IEventHandler<DeleteMenuEvent> {
  constructor(
    @Inject(InjectionToken.MENU_REPOSITORY)
    private readonly menuRepository: MenuRepository
  ) {}

  async handle(event: DeleteMenuEvent) {
    const { id } = event;
    await this.menuRepository.delete(id);
    return true;
  }
}
