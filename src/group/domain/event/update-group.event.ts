import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class UpdateGroupEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly market_id: number,
    readonly name: string,
    readonly content: string
  ) {
    super(UpdateGroupEvent.name);
  }
}
