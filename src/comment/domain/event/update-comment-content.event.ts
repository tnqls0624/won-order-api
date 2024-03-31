import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class UpdateCommentContentEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly content: string
  ) {
    super(UpdateCommentContentEvent.name);
  }
}
