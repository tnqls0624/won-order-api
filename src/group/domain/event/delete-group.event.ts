import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class DeleteGroupEvent extends CqrsEvent implements IEvent {
  constructor(readonly id: number) {
    super(DeleteGroupEvent.name);
  }
}
