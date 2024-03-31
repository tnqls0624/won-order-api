import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from '../../cqrs-events';

export class OrderSendEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly market_id: string,
    readonly body: unknown
  ) {
    super(OrderSendEvent.name);
  }
}
