import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class UpdateVerificationEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly token: string,
    readonly code: string
  ) {
    super(UpdateVerificationEvent.name);
  }
}
