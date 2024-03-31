import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class DeleteMenuEvent extends CqrsEvent implements IEvent {
  constructor(readonly id: number) {
    super(DeleteMenuEvent.name);
  }
}
