import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { CommentQuery } from './comment.query';
import { FindAllCommentForUserQuery } from './find-all-comment-for-user.query';

@QueryHandler(FindAllCommentForUserQuery)
export class FindAllCommentForUserQueryHandler
  implements IQueryHandler<FindAllCommentForUserQuery>
{
  constructor(
    @Inject(InjectionToken.COMMENT_QUERY)
    readonly commentQuery: CommentQuery
  ) {}

  async execute(query: FindAllCommentForUserQuery) {
    const userInfo = query.user_info ? await query.user_info : null;
    const userId = userInfo ? userInfo.id : null;
    return this.commentQuery.findAll(query.prams, userId, query.page_options);
  }
}
