import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { DeleteNoticeEvent } from '../../domain/event/delete-notice.event';
import { NoticeRepository } from '../../domain/notice.repository';

@EventsHandler(DeleteNoticeEvent)
export class DeleteNoticeHandler implements IEventHandler<DeleteNoticeEvent> {
  constructor(
    @Inject(InjectionToken.NOTICE_REPOSITORY)
    private readonly noticeRepository: NoticeRepository
  ) {}

  async handle(event: DeleteNoticeEvent) {
    const { id } = event;
    await this.noticeRepository.delete(id);
  }
}
