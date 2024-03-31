import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { FindAllGroupQuery } from './find-all-group.query';
import { GroupQuery } from './group.query';

@QueryHandler(FindAllGroupQuery)
export class FindAllGroupQueryHandler
  implements IQueryHandler<FindAllGroupQuery>
{
  constructor(
    @Inject(InjectionToken.GROUP_QUERY)
    readonly groupQuery: GroupQuery
  ) {}

  async execute(query: FindAllGroupQuery) {
    const { admin } = query;
    const groups = await this.groupQuery.findAll(admin.market_id);
    return groups;
  }
}
