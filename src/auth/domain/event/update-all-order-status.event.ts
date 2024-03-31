import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';
import { MainOrderStatus } from 'src/order/infrastructure/entity/main-order.entity';

export class UpdateAllOrderStatusEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly market_id: number,
    readonly group_id: string,
    readonly status: MainOrderStatus
  ) {
    super(UpdateAllOrderStatusEvent.name);
  }
}
