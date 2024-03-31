import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';
import { UpdateMenuCategoryDto } from 'src/menu/interface/dto/update-menu-category.dto';

export class UpdateMenuCategoryEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly market_id: number,
    readonly body: UpdateMenuCategoryDto
  ) {
    super(UpdateMenuCategoryEvent.name);
  }
}
