import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class UpdateUserPasswordEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly password: string
  ) {
    super(UpdateUserPasswordEvent.name);
  }
}
