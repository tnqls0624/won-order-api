import { ICommand } from '@nestjs/cqrs';
import { CreateCommentDto } from '../../interface/dto/create-comment.dto';
import { UserDto } from '../../../auth/interface/dto/model/user.dto';

export class CreateCommentCommand implements ICommand {
  constructor(
    readonly user_info: Promise<UserDto> | null,
    readonly body: CreateCommentDto
  ) {}
}
