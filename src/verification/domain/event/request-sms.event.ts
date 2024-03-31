import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class RequestSmsEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly phone: string,
    readonly code: string
  ) {
    super(RequestSmsEvent.name);
  }
}
