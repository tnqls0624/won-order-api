import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { CommentQuery } from './comment.query';
import { FindOneCommentQuery } from './find-one-comment.query';
import CustomError from '../../../common/error/custom-error';
import ResultCode from '../../../constant/result-code';
import { CommentFactory } from '../../domain/comment.factory';

@QueryHandler(FindOneCommentQuery)
export class FindOneCommentQueryHandler
  implements IQueryHandler<FindOneCommentQuery>
{
  constructor(
    @Inject(InjectionToken.COMMENT_QUERY)
    readonly commentQuery: CommentQuery,
    @Inject(InjectionToken.COMMENT_FACTORY)
    readonly commentFactory: CommentFactory
  ) {}

  async execute(query: FindOneCommentQuery) {
    const userInfo = query.user_info ? await query.user_info : null;
    const userId = userInfo ? userInfo.id : null;
    const entity = await this.commentQuery.findByIdWithChild(query.id);
    if (!entity) {
      throw new CustomError(ResultCode.NOT_FOUND_COMMENT);
    }
    const comment = this.commentFactory.reconstitute({
      ...entity
    });
    if (!entity.is_secret) {
      return entity;
    }
    if (comment.isMine(userId, query.password)) {
      return entity;
    }
    throw new CustomError(ResultCode.IS_NOT_MINE);
  }
}
