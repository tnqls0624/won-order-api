import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { MainOrderQuery } from './main-order.query';
import { FindProductsQuery } from './find-products.query';

@QueryHandler(FindProductsQuery)
export class FindProductsQueryHandler implements IQueryHandler<FindProductsQuery> {
  constructor(
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    readonly mainOrderQuery: MainOrderQuery
  ) {}

  async execute(query: FindProductsQuery) {
    const { admin, order_menu_stats_id, group_id } = query;
    return this.mainOrderQuery.findProducts(admin, order_menu_stats_id, group_id);
  }
}
