import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { OrderMenuRepository } from 'src/order/domain/order-menu/order-menu.repository';
import { MainOrderQuery } from '../query/main-order.query';
import { OrderMenuStatus } from 'src/order/infrastructure/entity/order-menu.entity';
import { RefundAbaOrderEvent } from 'src/order/domain/event/refund-aba-order.event';

@EventsHandler(RefundAbaOrderEvent)
export class RefundAbaOrderEventHandler
  implements IEventHandler<RefundAbaOrderEvent>
{
  constructor(
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    private readonly mainOrderQuery: MainOrderQuery,
    @Inject(InjectionToken.ORDER_MENU_REPOSITORY)
    private readonly orderMenuRepository: OrderMenuRepository
  ) {}

  async handle(event: RefundAbaOrderEvent) {
    const { id } = event;
    const menu_ids = await this.mainOrderQuery.findMenus(id);
    await this.orderMenuRepository.updates(
      menu_ids,
      id,
      OrderMenuStatus.CANCEL
    );
    return true;
  }
}
