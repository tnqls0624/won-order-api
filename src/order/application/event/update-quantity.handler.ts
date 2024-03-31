import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventGateway } from 'src/event/gateway/event.gateway';
import { UpdateQuantityEvent } from 'src/order/domain/event/update-quantity.event';
import { OrderMenuRepository } from 'src/order/domain/order-menu/order-menu.repository';
import { InjectionToken } from '../injection-token';
import { MainOrderQuery } from '../query/main-order.query';

@EventsHandler(UpdateQuantityEvent)
export class UpdateQuantityEventHndler
  implements IEventHandler<UpdateQuantityEvent>
{
  constructor(
    private readonly eventGateway: EventGateway,
    @Inject(InjectionToken.ORDER_MENU_REPOSITORY)
    private readonly orderMenuRepository: OrderMenuRepository,
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    private readonly mainOrderQuery: MainOrderQuery
  ) {}

  async handle(event: UpdateQuantityEvent) {
    const { id, main_order_id, quantity } = event;
    await this.orderMenuRepository.updateQuantity(id, main_order_id, quantity);
    const main_order =
      await this.mainOrderQuery.findFirstMainOrderById(main_order_id);
    this.eventGateway.employeeOrderUpdateEvent(main_order);
    this.eventGateway.masterOrderUpdateEvent(main_order);
    this.eventGateway.customerOrderUpdateEvent(main_order);
  }
}
