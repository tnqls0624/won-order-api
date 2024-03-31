import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';
import { Contact } from '../contact';

export class ReplyContactEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly body: Contact
  ) {
    super(ReplyContactEvent.name);
  }
}
