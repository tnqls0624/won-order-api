import { PageOptionsDto } from '../../../utils/paginate/dto';
import { FindAllCommentForUserParams } from '../../interface/param/find-all-comment-for-user.params';
import { CommentEntity } from '../../infrastructure/entity/comment.entity';

export interface CommentQuery {
  findAll: (
    prams: FindAllCommentForUserParams,
    user_id: number | null,
    page_options: PageOptionsDto
  ) => Promise<any | null>;
  findByIdWithChild: (id: number) => Promise<CommentEntity | null>;
}
