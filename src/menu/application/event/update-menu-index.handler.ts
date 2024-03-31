import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateMenuIndexEvent } from 'src/menu/domain/event/update-menu-index.event';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { InjectionToken } from '../Injection-token';

@EventsHandler(UpdateMenuIndexEvent)
export class UpdateMenuIndexEventEventHandler
  implements IEventHandler<UpdateMenuIndexEvent>
{
  constructor(
    @Inject(InjectionToken.MENU_REPOSITORY)
    private readonly menuRepository: MenuRepository
  ) {}

  async handle(event: UpdateMenuIndexEvent) {
    const { id, index } = event;
    await this.menuRepository.updateIndex(id, index);
    return true;
  }
}
