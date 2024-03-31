import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { CheckDuplicatedPhoneQuery } from './check-duplicated-phone.query';
import { UserQuery } from './user.query';

@QueryHandler(CheckDuplicatedPhoneQuery)
export class CheckDuplicatedPhoneQueryHandler
  implements IQueryHandler<CheckDuplicatedPhoneQuery>
{
  constructor(
    @Inject(InjectionToken.USER_QUERY)
    readonly userQuery: UserQuery
  ) {}

  async execute(query: CheckDuplicatedPhoneQuery) {
    const { phone } = query;
    if (!phone) throw new CustomError(RESULT_CODE.AUTH_NEED_PHONE_NUMBER);
    const validate = await this.userQuery.checkDuplicateByPhone(phone);
    if (validate) throw new CustomError(RESULT_CODE.DUPLICATED_PHONE);
    return true;
  }
}
