import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class DeleteMenuCategoryEvent extends CqrsEvent implements IEvent {
  constructor(readonly id: number) {
    super(DeleteMenuCategoryEvent.name);
  }
}
