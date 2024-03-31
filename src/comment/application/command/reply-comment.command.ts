import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from '../../../auth/interface/dto/model/admin.dto';
import { ReplyCommentDto } from '../../interface/dto/reply-comment.dto';

export class ReplyCommentCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly body: ReplyCommentDto
  ) {}
}
