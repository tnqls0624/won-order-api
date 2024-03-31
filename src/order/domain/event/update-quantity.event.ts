import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class UpdateQuantityEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly main_order_id: number,
    readonly quantity: number
  ) {
    super(UpdateQuantityEvent.name);
  }
}
