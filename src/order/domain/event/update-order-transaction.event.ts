import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class UpdateOrderTransactionEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly status: number
  ) {
    super(UpdateOrderTransactionEvent.name);
  }
}
