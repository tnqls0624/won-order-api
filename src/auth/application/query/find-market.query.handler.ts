import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { AdminQuery } from './admin.query';
import { FindMarketQuery } from './find-market.query';

@QueryHandler(FindMarketQuery)
export class FindMarketQueryHandler implements IQueryHandler<FindMarketQuery> {
  constructor(
    @Inject(InjectionToken.ADMIN_QUERY)
    readonly adminQuery: AdminQuery
  ) {}

  async execute(query: FindMarketQuery) {
    const { id } = query;
    const market = await this.adminQuery.findMarketById(id);
    if (!market) throw new CustomError(RESULT_CODE.NOT_FOUND_MARKET);
    return market;
  }
}
