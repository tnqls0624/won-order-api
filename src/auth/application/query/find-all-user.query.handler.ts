import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { UserQuery } from 'src/auth/application/query/user.query';
import { FindAllUserQuery } from './find-all-user.query';

@QueryHandler(FindAllUserQuery)
export class FindAllUserQueryHandler
  implements IQueryHandler<FindAllUserQuery>
{
  constructor(
    @Inject(InjectionToken.USER_QUERY)
    readonly userQuery: UserQuery
  ) {}

  async execute(query: FindAllUserQuery) {
    const { phone, name } = query;
    return this.userQuery.findAll(phone, name);
  }
}
