import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventGateway } from 'src/event/gateway/event.gateway';
import { UpdateQuantityEvent } from 'src/order/domain/event/update-quantity.event';
import { OrderMenuRepository } from 'src/order/domain/order-menu/order-menu.repository';
import { InjectionToken } from '../injection-token';
import { MainOrderQuery } from '../query/main-order.query';
import { UpdateOrderTransactionEvent } from 'src/order/domain/event/update-order-transaction.event';
import { OrderTransactionRepository } from 'src/order/domain/order-transaction/order-transaction.repository';

@EventsHandler(UpdateOrderTransactionEvent)
export class UpdateOrderTransactionEventHandler
  implements IEventHandler<UpdateOrderTransactionEvent>
{
  constructor(
    @Inject(InjectionToken.ORDER_TRANSACTION_REPOSITORY)
    private readonly orderTransactionRepository: OrderTransactionRepository,
  ) {}

  async handle(event: UpdateOrderTransactionEvent) {
    const { id, status } = event;
    await this.orderTransactionRepository.update(id, status);
  }
}
