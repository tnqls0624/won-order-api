import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { FindAllMainOrdersAdminQuery } from './find-all-main-order-admin.query';
import { MainOrderQuery } from './main-order.query';

@QueryHandler(FindAllMainOrdersAdminQuery)
export class FindAllMainOrdersAdminQueryHandler
  implements IQueryHandler<FindAllMainOrdersAdminQuery>
{
  constructor(
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    readonly mainOrderQuery: MainOrderQuery
  ) {}

  async execute(query: FindAllMainOrdersAdminQuery) {
    const { admin, params, page_options } = query;
    return this.mainOrderQuery.findAllByAdmin(admin, params, page_options);
  }
}
