import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventGateway } from 'src/event/gateway/event.gateway';
import { UpdateOrderEvent } from 'src/order/domain/event/update-order.event';
import { MainOrderRepository } from 'src/order/domain/main-order/main-order.repository';
import { InjectionToken } from '../injection-token';
import { MainOrderQuery } from '../query/main-order.query';

@EventsHandler(UpdateOrderEvent)
export class UpdateOrderEventHndler implements IEventHandler<UpdateOrderEvent> {
  constructor(
    private readonly eventGateway: EventGateway,
    @Inject(InjectionToken.MAIN_ORDER_REPOSITORY)
    private readonly mainOrderRepository: MainOrderRepository,
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    private readonly mainOrderQuery: MainOrderQuery
  ) {}

  async handle(event: UpdateOrderEvent) {
    const { id, body } = event;
    await this.mainOrderRepository.updateOrder(id, body);
    const main_order = await this.mainOrderQuery.findFirstMainOrderById(id);
    this.eventGateway.employeeOrderUpdateEvent(main_order);
    this.eventGateway.masterOrderUpdateEvent(main_order);
    this.eventGateway.customerOrderUpdateEvent(main_order);
  }
}
