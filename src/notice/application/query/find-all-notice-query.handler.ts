import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { FindAllNoticeQuery } from './find-all-notice.query';
import { NoticeQuery } from './notice.query';

@QueryHandler(FindAllNoticeQuery)
export class FindAllNoticeQueryHandler
  implements IQueryHandler<FindAllNoticeQuery>
{
  constructor(
    @Inject(InjectionToken.NOTICE_QUERY)
    readonly noticeQuery: NoticeQuery
  ) {}

  async execute(query: FindAllNoticeQuery) {
    const { group_id, market_id, page_options } = query;
    return this.noticeQuery.findAll(group_id, market_id, page_options);
  }
}
