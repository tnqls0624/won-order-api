import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class ReplyContactMailSendEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly email: string,
    readonly content: string,
    readonly title: string
  ) {
    super(ReplyContactMailSendEvent.name);
  }
}
