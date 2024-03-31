import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AdminQuery } from 'src/auth/application/query/admin.query';
import { InjectionToken } from '../Injection-token';
import { FindAllEmployeeQuery } from './find-all-employee.query';

@QueryHandler(FindAllEmployeeQuery)
export class FindAllEmployeeQueryHandler
  implements IQueryHandler<FindAllEmployeeQuery>
{
  constructor(
    @Inject(InjectionToken.ADMIN_QUERY)
    readonly adminQuery: AdminQuery
  ) {}

  async execute(query: FindAllEmployeeQuery) {
    const { admin, group_id, admin_id, name, page_query } = query;
    return this.adminQuery.findAll(admin, group_id, admin_id, name, page_query);
  }
}
