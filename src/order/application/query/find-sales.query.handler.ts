import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { FindSalesQuery } from './find-sales.query';
import { MainOrderQuery } from './main-order.query';

@QueryHandler(FindSalesQuery)
export class FindSalesQueryHandler implements IQueryHandler<FindSalesQuery> {
  constructor(
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    readonly mainOrderQuery: MainOrderQuery
  ) {}

  async execute(query: FindSalesQuery) {
    const { admin, params, page_option } = query;
    return this.mainOrderQuery.findSales(admin, params, page_option);
  }
}
