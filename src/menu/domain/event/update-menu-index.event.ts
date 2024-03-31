import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class UpdateMenuIndexEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly index: number
  ) {
    super(UpdateMenuIndexEvent.name);
  }
}
