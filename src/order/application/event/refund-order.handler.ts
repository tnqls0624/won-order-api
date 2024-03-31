import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { RefundOrderEvent } from 'src/order/domain/event/refund-order.event';
import { MainOrderRepository } from 'src/order/domain/main-order/main-order.repository';

@EventsHandler(RefundOrderEvent)
export class RefundOrderEventHandler
  implements IEventHandler<RefundOrderEvent>
{
  constructor(
    @Inject(InjectionToken.MAIN_ORDER_REPOSITORY)
    private readonly mainOrderRepository: MainOrderRepository
  ) {}

  async handle(event: RefundOrderEvent) {
    const { id, group_id } = event;
    await this.mainOrderRepository.refund(id, group_id);
    return true;
  }
}
