import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { GroupQuery } from './group.query';
import { FindAllGroupUserQuery } from './find-all-group-user.query';

@QueryHandler(FindAllGroupUserQuery)
export class FindAllGroupUserQueryHandler
  implements IQueryHandler<FindAllGroupUserQuery>
{
  constructor(
    @Inject(InjectionToken.GROUP_QUERY)
    readonly groupQuery: GroupQuery
  ) {}

  async execute(query: FindAllGroupUserQuery) {
    const { market_id } = query;
    const groups = await this.groupQuery.findAll(market_id);
    return groups;
  }
}
