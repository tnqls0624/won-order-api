import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { AdminQuery } from './admin.query';
import { AdminType } from 'src/types/login.type';
import { FindMasterQuery } from './find-master.query';

@QueryHandler(FindMasterQuery)
export class FindMasterQueryHandler implements IQueryHandler<FindMasterQuery> {
  constructor(
    @Inject(InjectionToken.ADMIN_QUERY)
    readonly adminQuery: AdminQuery
  ) {}

  async execute(query: FindMasterQuery) {
    const { id } = query;
    const master = await this.adminQuery.findById(id);
    if (!master) throw new CustomError(RESULT_CODE.NOT_FOUND_ADMIN);
    if (master.type !== AdminType.MASTER)
      throw new CustomError(RESULT_CODE.NOT_MASTER);
    return master;
  }
}
