import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class RefundAbaOrderEvent extends CqrsEvent implements IEvent {
  constructor(readonly id: number) {
    super(RefundAbaOrderEvent.name);
  }
}
