import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { FindAllTableQuery } from './find-all-table.query';
import { TableQuery } from './table.query';

@QueryHandler(FindAllTableQuery)
export class FindAllTableQueryHandler
  implements IQueryHandler<FindAllTableQuery>
{
  constructor(
    @Inject(InjectionToken.TABLE_QUERY)
    readonly tableQuery: TableQuery
  ) {}

  async execute(query: FindAllTableQuery) {
    const { admin, group_id, page_options } = query;
    return this.tableQuery.findAll(
      admin.market_id,
      group_id,
      admin.language_id,
      page_options
    );
  }
}
