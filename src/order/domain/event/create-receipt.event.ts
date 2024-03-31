import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class CreateReceiptEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly market_id: number,
    readonly group_id: number,
    readonly id: number,
    readonly language_code: string
  ) {
    super(CreateReceiptEvent.name);
  }
}
