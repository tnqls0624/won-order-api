import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { MainOrderQuery } from './main-order.query';
import { FindDashboardSalesMenusQuery } from './find-dashboard-sales-menus.query';

@QueryHandler(FindDashboardSalesMenusQuery)
export class FindDashboardSalesMenusQueryHandler
  implements IQueryHandler<FindDashboardSalesMenusQuery>
{
  constructor(
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    readonly mainOrderQuery: MainOrderQuery
  ) {}

  async execute(query: FindDashboardSalesMenusQuery) {
    const { admin, time_zone } = query;
    return this.mainOrderQuery.findDashboardSalesMenus(admin, time_zone);
  }
}
