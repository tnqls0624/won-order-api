import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class UpdateAdminPasswordEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly password: string
  ) {
    super(UpdateAdminPasswordEvent.name);
  }
}
