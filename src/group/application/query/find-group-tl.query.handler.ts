import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { GroupQuery } from './group.query';
import { FindGroupTlQuery } from './find-group-tl.query';

@QueryHandler(FindGroupTlQuery)
export class FindGroupTlQueryHandler
  implements IQueryHandler<FindGroupTlQuery>
{
  constructor(
    @Inject(InjectionToken.GROUP_QUERY)
    readonly groupQuery: GroupQuery
  ) {}

  async execute(query: FindGroupTlQuery) {
    const { id } = query;
    const group = await this.groupQuery.findGroupTl(id);
    return group;
  }
}
