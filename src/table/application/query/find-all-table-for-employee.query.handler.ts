import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { FindAllTableForEmployeeQuery } from './find-all-table-for-employee.query';
import { TableQuery } from './table.query';

@QueryHandler(FindAllTableForEmployeeQuery)
export class FindAllTableForEmployeeQueryHandler
  implements IQueryHandler<FindAllTableForEmployeeQuery>
{
  constructor(
    @Inject(InjectionToken.TABLE_QUERY)
    readonly tableQuery: TableQuery
  ) {}

  async execute(query: FindAllTableForEmployeeQuery) {
    const { admin } = query;
    return this.tableQuery.findAllForEmployee(admin);
  }
}
