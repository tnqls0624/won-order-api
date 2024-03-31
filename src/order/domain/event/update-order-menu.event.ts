import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';
import { OrderMenuStatus } from 'src/order/infrastructure/entity/order-menu.entity';

export class UpdateOrderMenuEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly main_order_id: number,
    readonly status: OrderMenuStatus
  ) {
    super(UpdateOrderMenuEvent.name);
  }
}
