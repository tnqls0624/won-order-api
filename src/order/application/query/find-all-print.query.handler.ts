import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { MainOrderQuery } from './main-order.query';
import { FindAllPrintQuery } from './find-all-print.query';

@QueryHandler(FindAllPrintQuery)
export class FindAllPrintQueryHandler
  implements IQueryHandler<FindAllPrintQuery>
{
  constructor(
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    readonly mainOrderQuery: MainOrderQuery
  ) {}

  async execute(query: FindAllPrintQuery) {
    const { market_id, group_id } = query;
    return this.mainOrderQuery.findAllPrintByMarketId(
      market_id,
      group_id
    );
  }
}
