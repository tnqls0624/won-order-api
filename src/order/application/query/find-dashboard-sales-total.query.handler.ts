import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { MainOrderQuery } from './main-order.query';
import { FindDashboardSalesTotalQuery } from './find-dashboard-sales-total.query';

@QueryHandler(FindDashboardSalesTotalQuery)
export class FindDashboardSalesTotalQueryHandler
  implements IQueryHandler<FindDashboardSalesTotalQuery>
{
  constructor(
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    readonly mainOrderQuery: MainOrderQuery
  ) {}

  async execute(query: FindDashboardSalesTotalQuery) {
    const { admin, time_zone } = query;
    return this.mainOrderQuery.findDashboardSalesTotal(admin, time_zone);
  }
}
