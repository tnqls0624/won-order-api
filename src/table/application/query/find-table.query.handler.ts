import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { TableQuery } from './table.query';
import { FindTableQuery } from './find-table.query';

@QueryHandler(FindTableQuery)
export class FindTableQueryHandler implements IQueryHandler<FindTableQuery> {
  constructor(
    @Inject(InjectionToken.TABLE_QUERY)
    readonly tableQuery: TableQuery
  ) {}

  async execute(query: FindTableQuery) {
    const { id } = query;
    return this.tableQuery.findById(id);
  }
}
