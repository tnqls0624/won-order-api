import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventGateway } from 'src/event/gateway/event.gateway';
import { UpdateMainOrderEvent } from 'src/order/domain/event/update-main-order.event';
import { MainOrderRepository } from 'src/order/domain/main-order/main-order.repository';
import { InjectionToken } from '../injection-token';
import { MainOrderQuery } from '../query/main-order.query';

@EventsHandler(UpdateMainOrderEvent)
export class UpdateMainOrderEventHndler
  implements IEventHandler<UpdateMainOrderEvent>
{
  constructor(
    private readonly eventGateway: EventGateway,
    @Inject(InjectionToken.MAIN_ORDER_REPOSITORY)
    private readonly mainOrderRepository: MainOrderRepository,
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    private readonly mainOrderQuery: MainOrderQuery
  ) {}

  async handle(event: UpdateMainOrderEvent) {
    const { id, status } = event;
    await this.mainOrderRepository.update(id, status);
    const main_order = await this.mainOrderQuery.findFirstMainOrderById(id);
    const message = {
      main_order_id: main_order.id,
      status
    };
    this.eventGateway.customerOrderUpdateEvent(message);
    this.eventGateway.employeeOrderUpdateEvent(message);
    this.eventGateway.masterOrderUpdateEvent(message);
  }
}
