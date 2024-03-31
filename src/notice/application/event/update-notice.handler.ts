import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { NoticeRepository } from '../../domain/notice.repository';
import { UpdateNoticeEvent } from '../../domain/event/update-notice.event';

@EventsHandler(UpdateNoticeEvent)
export class UpdateNoticeHandler implements IEventHandler<UpdateNoticeEvent> {
  constructor(
    @Inject(InjectionToken.NOTICE_REPOSITORY)
    private readonly noticeRepository: NoticeRepository
  ) {}

  async handle(event: UpdateNoticeEvent) {
    const { id, body } = event;
    await this.noticeRepository.update(id, body);
  }
}
