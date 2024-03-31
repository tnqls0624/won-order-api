import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteMenuCategoryEvent } from 'src/menu/domain/event/delete-menu-category.event';
import { MenuCategoryRepository } from 'src/menu/domain/menu-category.repository';
import { InjectionToken } from '../Injection-token';

@EventsHandler(DeleteMenuCategoryEvent)
export class DeleteMenuCategoryEventHandler
  implements IEventHandler<DeleteMenuCategoryEvent>
{
  constructor(
    @Inject(InjectionToken.MENUCATEGORY_REPOSITORY)
    private readonly menuCategoryRepository: MenuCategoryRepository
  ) {}

  async handle(event: DeleteMenuCategoryEvent) {
    const { id } = event;
    await this.menuCategoryRepository.delete(id);
    return true;
  }
}
