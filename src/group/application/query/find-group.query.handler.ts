import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { FindGroupQuery } from './find-group.query';
import { GroupQuery } from './group.query';

@QueryHandler(FindGroupQuery)
export class FindGroupQueryHandler implements IQueryHandler<FindGroupQuery> {
  constructor(
    @Inject(InjectionToken.GROUP_QUERY)
    readonly groupQuery: GroupQuery
  ) {}

  async execute(query: FindGroupQuery) {
    const { id } = query;
    const group = await this.groupQuery.findById(id);
    return group;
  }
}
