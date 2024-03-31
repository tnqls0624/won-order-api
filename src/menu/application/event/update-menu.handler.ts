import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateMenuEvent } from 'src/menu/domain/event/update-menu.event';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { InjectionToken } from '../Injection-token';

@EventsHandler(UpdateMenuEvent)
export class UpdateMenuEventHandler implements IEventHandler<UpdateMenuEvent> {
  constructor(
    @Inject(InjectionToken.MENU_REPOSITORY)
    private readonly menuRepository: MenuRepository
  ) {}

  async handle(event: UpdateMenuEvent) {
    const { market_id, id, body } = event;
    await this.menuRepository.update(market_id, id, body);
    return true;
  }
}
