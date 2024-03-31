import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateMenuCategoryEvent } from 'src/menu/domain/event/update-menu-category.event';
import { MenuCategoryRepository } from 'src/menu/domain/menu-category.repository';
import { InjectionToken } from '../Injection-token';

@EventsHandler(UpdateMenuCategoryEvent)
export class UpdateMenuCategoryEventHandler
  implements IEventHandler<UpdateMenuCategoryEvent>
{
  constructor(
    @Inject(InjectionToken.MENUCATEGORY_REPOSITORY)
    private readonly menuCategoryRepository: MenuCategoryRepository
  ) {}

  async handle(event: UpdateMenuCategoryEvent) {
    const { market_id, id, body } = event;
    await this.menuCategoryRepository.update(id, market_id, body);
    return true;
  }
}
