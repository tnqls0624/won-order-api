import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { CheckDuplicatedNickNameQuery } from './check-duplicated-nickname.query';
import { UserQuery } from './user.query';

@QueryHandler(CheckDuplicatedNickNameQuery)
export class CheckDuplicatedNickNameQueryHandler
  implements IQueryHandler<CheckDuplicatedNickNameQuery>
{
  constructor(
    @Inject(InjectionToken.USER_QUERY)
    readonly userQuery: UserQuery
  ) {}

  async execute(query: CheckDuplicatedNickNameQuery) {
    const { nickname } = query;
    if (!nickname) throw new CustomError(RESULT_CODE.AUTH_NEED_NAME);
    const validate = await this.userQuery.checkDuplicateByNickName(nickname);
    if (validate) throw new CustomError(RESULT_CODE.DUPLICATED_ADMIN_ID);
    return true;
  }
}
