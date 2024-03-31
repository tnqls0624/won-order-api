import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { FindAllMainOrdersQuery } from './find-all-main-order.query';
import { MainOrderQuery } from './main-order.query';

@QueryHandler(FindAllMainOrdersQuery)
export class FindAllMainOrdersQueryHandler
  implements IQueryHandler<FindAllMainOrdersQuery>
{
  constructor(
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    readonly mainOrderQuery: MainOrderQuery
  ) {}

  async execute(query: FindAllMainOrdersQuery) {
    const { user_id, params, page_options } = query;
    return this.mainOrderQuery.findAll(user_id, params, page_options);
  }
}
