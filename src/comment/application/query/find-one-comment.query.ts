import { IQuery } from '@nestjs/cqrs';
import { UserDto } from '../../../auth/interface/dto/model/user.dto';

export class FindOneCommentQuery implements IQuery {
  constructor(
    readonly user_info: Promise<UserDto> | null,
    readonly password: string,
    readonly id: number
  ) {}
}
