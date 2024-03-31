import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class DeliveryDevicePushEvent extends CqrsEvent implements IEvent {
  constructor(readonly message: any) {
    super(DeliveryDevicePushEvent.name);
  }
}
