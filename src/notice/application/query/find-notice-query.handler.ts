import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { NoticeQuery } from './notice.query';
import { FindNoticeQuery } from './find-notice-query';

@QueryHandler(FindNoticeQuery)
export class FindNoticeQueryHandler implements IQueryHandler<FindNoticeQuery> {
  constructor(
    @Inject(InjectionToken.NOTICE_QUERY)
    readonly noticeQuery: NoticeQuery
  ) {}

  async execute(query: FindNoticeQuery) {
    return this.noticeQuery.findById(query.id);
  }
}
