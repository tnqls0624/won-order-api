import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateMenuCategoryIndexEvent } from 'src/menu/domain/event/update-menu-category-index.event';
import { MenuCategoryRepository } from 'src/menu/domain/menu-category.repository';
import { InjectionToken } from '../Injection-token';

@EventsHandler(UpdateMenuCategoryIndexEvent)
export class UpdateMenuCategoryIndexEventHandler
  implements IEventHandler<UpdateMenuCategoryIndexEvent>
{
  constructor(
    @Inject(InjectionToken.MENUCATEGORY_REPOSITORY)
    private readonly menuCategoryRepository: MenuCategoryRepository
  ) {}

  async handle(event: UpdateMenuCategoryIndexEvent) {
    const { id, index } = event;
    await this.menuCategoryRepository.updateIndex(id, index);
    return true;
  }
}
