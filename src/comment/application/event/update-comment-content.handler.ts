import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { UpdateCommentContentEvent } from '../../domain/event/update-comment-content.event';
import { CommentRepository } from '../../domain/comment.repository';

@EventsHandler(UpdateCommentContentEvent)
export class UpdateCommentContentHandler
  implements IEventHandler<UpdateCommentContentEvent>
{
  constructor(
    @Inject(InjectionToken.COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository
  ) {}

  async handle(event: UpdateCommentContentEvent) {
    const { id, content } = event;
    await this.commentRepository.updateContent(content, id);
  }
}
