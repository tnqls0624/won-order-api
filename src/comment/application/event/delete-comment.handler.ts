import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { CommentRepository } from '../../domain/comment.repository';
import { DeleteNoticeEvent } from '../../../notice/domain/event/delete-notice.event';

@EventsHandler(DeleteNoticeEvent)
export class DeleteCommentHandler implements IEventHandler<DeleteNoticeEvent> {
  constructor(
    @Inject(InjectionToken.COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository
  ) {}

  async handle(event: DeleteNoticeEvent) {
    const { id } = event;
    await this.commentRepository.delete(id);
  }
}
