import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { CommentRepository } from '../../domain/comment.repository';
import { CommentFactory } from '../../domain/comment.factory';
import { ReplyCommentCommand } from './reply-comment.command';
import CustomError from '../../../common/error/custom-error';
import { RESULT_CODE } from '../../../constant';

@CommandHandler(ReplyCommentCommand)
export class ReplyCommentCommentHandler
  implements ICommandHandler<ReplyCommentCommand>
{
  constructor(
    @Inject(InjectionToken.COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
    @Inject(InjectionToken.COMMENT_FACTORY)
    private readonly commentFactory: CommentFactory
  ) {}

  async execute(command: ReplyCommentCommand) {
    const { admin, body } = command;

    const parent = await this.commentRepository.findById(body.parent_id);
    if (!parent) {
      throw new CustomError(RESULT_CODE.NOT_FOUND_COMMENT);
    }

    const comment = this.commentFactory.create({
      ...body,
      password: null,
      is_secret: parent.is_secret,
      group_id: parent.group_id,
      writer_id: admin.id,
      writer_name: admin.nickname
    });
    return this.commentRepository.save(comment);
  }
}
