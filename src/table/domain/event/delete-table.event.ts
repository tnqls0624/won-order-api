import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class DeleteTableEvent extends CqrsEvent implements IEvent {
  constructor(readonly id: number) {
    super(DeleteTableEvent.name);
  }
}
