import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { MainOrderQuery } from './main-order.query';
import { FindDashboardSalesRankQuery } from './find-dashboard-sales-rank.query';

@QueryHandler(FindDashboardSalesRankQuery)
export class FindDashboardSalesRankQueryHandler
  implements IQueryHandler<FindDashboardSalesRankQuery>
{
  constructor(
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    readonly mainOrderQuery: MainOrderQuery
  ) {}

  async execute(query: FindDashboardSalesRankQuery) {
    const { admin, time_zone } = query;
    return this.mainOrderQuery.findDashboardSalesRank(admin, time_zone);
  }
}
