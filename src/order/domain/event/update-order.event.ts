import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';
import { UpdateOrderDto } from 'src/order/interface/dto/update-order.dto';

export class UpdateOrderEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly body: UpdateOrderDto
  ) {
    super(UpdateOrderEvent.name);
  }
}
