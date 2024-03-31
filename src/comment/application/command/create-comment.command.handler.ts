import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { CommentRepository } from '../../domain/comment.repository';
import { CommentFactory } from '../../domain/comment.factory';
import { CreateCommentCommand } from './create-comment.command';
import CustomError from '../../../common/error/custom-error';
import { RESULT_CODE } from '../../../constant';

@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @Inject(InjectionToken.COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
    @Inject(InjectionToken.COMMENT_FACTORY)
    private readonly commentFactory: CommentFactory
  ) {}

  async execute(command: CreateCommentCommand) {
    const { user_info, body } = command;
    let id: number | null = null;
    let nickname: string | null = null;
    if (user_info) {
      const info = await user_info;
      id = info.id;
      nickname = info.nickname;
    }
    nickname = nickname || body.writer_name;
    if (!nickname) {
      // 사용자 닉네임, 비회원 설정 닉네임 둘다 없는 경우 에러 처리
      throw new CustomError(RESULT_CODE.INVALID_PARAMETER);
    }
    const comment = this.commentFactory.create({
      content: body.content,
      password: body.password,
      is_secret: body.is_secret,
      group_id: body.group_id,
      writer_id: id,
      writer_name: nickname,
      parent_id: null
    });
    return this.commentRepository.save(comment);
  }
}
