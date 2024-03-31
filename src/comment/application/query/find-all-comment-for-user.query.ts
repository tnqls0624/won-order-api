import { IQuery } from '@nestjs/cqrs';
import { PageOptionsDto } from '../../../utils/paginate/dto';
import { FindAllCommentForUserParams } from '../../interface/param/find-all-comment-for-user.params';
import { UserDto } from '../../../auth/interface/dto/model/user.dto';

export class FindAllCommentForUserQuery implements IQuery {
  constructor(
    readonly prams: FindAllCommentForUserParams,
    readonly user_info: Promise<UserDto> | null,
    readonly page_options: PageOptionsDto
  ) {}
}
