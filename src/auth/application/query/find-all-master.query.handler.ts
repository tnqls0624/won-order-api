import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { AdminQuery } from './admin.query';
import { FindAllMasterQuery } from './find-all-master.query';

@QueryHandler(FindAllMasterQuery)
export class FindAllMasterQueryHandler
  implements IQueryHandler<FindAllMasterQuery>
{
  constructor(
    @Inject(InjectionToken.ADMIN_QUERY)
    readonly adminQuery: AdminQuery
  ) {}

  async execute() {
    const masters = await this.adminQuery.findAllAdmin();
    return masters;
  }
}
