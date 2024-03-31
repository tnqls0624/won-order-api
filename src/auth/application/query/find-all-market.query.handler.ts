import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { FindAllMarketQuery } from './find-all-market.query';
import { MarketQuery } from './market.query';

@QueryHandler(FindAllMarketQuery)
export class FindAllMarketQueryHandler
  implements IQueryHandler<FindAllMarketQuery>
{
  constructor(
    @Inject(InjectionToken.MARKET_QUERY)
    readonly marketQuery: MarketQuery
  ) {}

  async execute() {
    return this.marketQuery.findAll();
  }
}
