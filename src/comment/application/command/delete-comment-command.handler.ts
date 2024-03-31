import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import CustomError from '../../../common/error/custom-error';
import { RESULT_CODE } from '../../../constant';
import { DeleteCommentCommand } from './delete-comment.command';
import { CommentRepository } from '../../domain/comment.repository';
import { CommentFactory } from '../../domain/comment.factory';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentCommandHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    @Inject(InjectionToken.COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
    @Inject(InjectionToken.COMMENT_FACTORY)
    private readonly commentFactory: CommentFactory
  ) {}

  async execute(command: DeleteCommentCommand) {
    const { id, password, user_info } = command;
    const userInfo = user_info ? await user_info : null;
    const userId = userInfo ? userInfo.id : null;
    const entity = await this.commentRepository.findById(id);
    if (!entity) {
      throw new CustomError(RESULT_CODE.NOT_FOUND_COMMENT);
    }

    const comment = this.commentFactory.reconstitute({
      ...entity
    });
    if (!comment.isMine(userId, password)) {
      throw new CustomError(RESULT_CODE.IS_NOT_MINE);
    }
    comment.delete();
    return true;
  }
}
