import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { NoticeQuery } from './notice.query';
import { FindAllNoticeForUserQuery } from './find-all-notice-for-user.query';

@QueryHandler(FindAllNoticeForUserQuery)
export class FindAllNoticeForUserQueryHandler
  implements IQueryHandler<FindAllNoticeForUserQuery>
{
  constructor(
    @Inject(InjectionToken.NOTICE_QUERY)
    readonly noticeQuery: NoticeQuery
  ) {}

  async execute(query: FindAllNoticeForUserQuery) {
    return this.noticeQuery.findByByIsActiveTrue(query.group_id);
  }
}
