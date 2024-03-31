import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { AdminQuery } from './admin.query';
import { CheckDuplicatedIdQuery } from './check-duplicated-id.query';

@QueryHandler(CheckDuplicatedIdQuery)
export class CheckDuplicatedIdQueryHandler
  implements IQueryHandler<CheckDuplicatedIdQuery>
{
  constructor(
    @Inject(InjectionToken.ADMIN_QUERY)
    readonly adminQuery: AdminQuery
  ) {}

  async execute(query: CheckDuplicatedIdQuery) {
    const { market_id, admin_id } = query;
    if (!market_id) throw new CustomError(RESULT_CODE.NOT_FOUND_MARKET);
    if (!admin_id) throw new CustomError(RESULT_CODE.NOT_FOUND_ADMIN);
    const validate = await this.adminQuery.checkDuplicateById(
      market_id,
      admin_id
    );
    if (!validate) throw new CustomError(RESULT_CODE.DUPLICATED_ADMIN_ID);
    return true;
  }
}
