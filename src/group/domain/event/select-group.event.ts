import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class SelectGroupEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly admin_id: number,
    readonly market_id: number,
    readonly select_ids: number[]
  ) {
    super(SelectGroupEvent.name);
  }
}
