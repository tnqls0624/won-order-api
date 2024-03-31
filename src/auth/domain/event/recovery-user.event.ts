import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class RecoveryUserEvent extends CqrsEvent implements IEvent {
  constructor(readonly id: number) {
    super(RecoveryUserEvent.name);
  }
}
