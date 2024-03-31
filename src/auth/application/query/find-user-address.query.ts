import { IQuery } from '@nestjs/cqrs';

export class FindUserAddressQuery implements IQuery {
  constructor(
    readonly user_id: string,
    readonly guest_id: string
  ) {}
}
