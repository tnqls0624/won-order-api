import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { NoticeRepository } from '../../domain/notice.repository';
import { UpdateNoticeIndexEvent } from '../../domain/event/update-notice-index.event';

@EventsHandler(UpdateNoticeIndexEvent)
export class UpdateNoticeIndexHandler
  implements IEventHandler<UpdateNoticeIndexEvent>
{
  constructor(
    @Inject(InjectionToken.NOTICE_REPOSITORY)
    private readonly noticeRepository: NoticeRepository
  ) {}

  async handle(event: UpdateNoticeIndexEvent) {
    const { id, index } = event;
    await this.noticeRepository.updateIndex(id, index);
  }
}
