import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OrderMenuStatus } from 'src/order/infrastructure/entity/order-menu.entity';
import { InjectionToken } from '../injection-token';
import { FindMainOrderAdminQuery } from './find-main-order-admin.query';
import { MainOrderQuery } from './main-order.query';

@QueryHandler(FindMainOrderAdminQuery)
export class FindMainOrderAdminQueryHandler
  implements IQueryHandler<FindMainOrderAdminQuery>
{
  constructor(
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    readonly mainOrderQuery: MainOrderQuery
  ) {}

  async execute(query: FindMainOrderAdminQuery) {
    const { admin, group_ids, main_order_id, order_menu_status } = query;
    return this.mainOrderQuery.findByAdminWithOrderId(
      admin,
      group_ids,
      main_order_id,
      order_menu_status as OrderMenuStatus
    );
  }
}
