import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { FindUserAddressQuery } from './find-user-address.query';
import { UserQuery } from './user.query';

@QueryHandler(FindUserAddressQuery)
export class FindUserAddressQueryHandler
  implements IQueryHandler<FindUserAddressQuery>
{
  constructor(
    @Inject(InjectionToken.USER_QUERY)
    readonly userQuery: UserQuery
  ) {}

  async execute(query: FindUserAddressQuery) {
    const { user_id, guest_id } = query;
    const address = await this.userQuery.findAddress(user_id, guest_id);
    return address;
  }
}
