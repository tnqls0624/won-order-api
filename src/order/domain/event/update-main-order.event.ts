import { IEvent } from '@nestjs/cqrs';
import { MainOrderStatus } from '@prisma/client';
import { CqrsEvent } from 'src/event/cqrs-events';

export class UpdateMainOrderEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly status: MainOrderStatus
  ) {
    super(UpdateMainOrderEvent.name);
  }
}
