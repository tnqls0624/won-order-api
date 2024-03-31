import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class RefundOrderEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly group_id: number
  ) {
    super(RefundOrderEvent.name);
  }
}
