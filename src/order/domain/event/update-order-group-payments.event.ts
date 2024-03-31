import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';
import { OrderGroupPaymentStatus } from 'src/order/infrastructure/entity/order-group-payment.entity';

export class UpdateOrderGroupPaymentEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly main_order_id: number,
    readonly status: OrderGroupPaymentStatus
  ) {
    super(UpdateOrderGroupPaymentEvent.name);
  }
}
