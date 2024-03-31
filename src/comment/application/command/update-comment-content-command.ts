import { ICommand } from '@nestjs/cqrs';
import { UpdateCommentDto } from '../../interface/dto/update-comment.dto';
import { UserDto } from '../../../auth/interface/dto/model/user.dto';

export class UpdateCommentContentCommand implements ICommand {
  constructor(
    readonly user_info: Promise<UserDto> | null,
    readonly id: number,
    readonly body: UpdateCommentDto
  ) {}
}
