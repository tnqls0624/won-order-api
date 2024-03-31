import { ICommand } from '@nestjs/cqrs';
import { UserDto } from '../../../auth/interface/dto/model/user.dto';

export class DeleteCommentCommand implements ICommand {
  constructor(
    readonly user_info: Promise<UserDto> | null,
    readonly password: string,
    readonly id: number
  ) {}
}
