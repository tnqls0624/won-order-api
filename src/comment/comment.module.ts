import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/auth/auth.module';
import { InjectionToken } from './application/Injection-token';
import { CommentRepositoryImplement } from './infrastructure/repository/comment.repository.implement';
import { CommentFactory } from './domain/comment.factory';
import { CommentDomainService } from './domain/comment.domain.service';
import { CommentController } from './interface/comment.controller';
import { CreateCommentCommandHandler } from './application/command/create-comment.command.handler';
import { ReplyCommentCommentHandler } from './application/command/reply-comment.command.handler';
import { CommentQueryImplement } from './infrastructure/query/comment.query.implement';
import { FindAllCommentForUserQueryHandler } from './application/query/find-all-comment-for-user.query.handler';
import { FindOneCommentQueryHandler } from './application/query/find-one-comment.query.handler';
import { DeleteCommentCommandHandler } from './application/command/delete-comment-command.handler';
import { UpdateCommentContentCommandHandler } from './application/command/update-comment-content-command.handler';
import { DeleteCommentHandler } from './application/event/delete-comment.handler';
import { UpdateCommentContentHandler } from './application/event/update-comment-content.handler';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.COMMENT_REPOSITORY,
    useClass: CommentRepositoryImplement
  },
  {
    provide: InjectionToken.COMMENT_QUERY,
    useClass: CommentQueryImplement
  },
  {
    provide: InjectionToken.COMMENT_FACTORY,
    useClass: CommentFactory
  }
];

const domain = [CommentDomainService, CommentFactory];

const application = [
  CreateCommentCommandHandler,
  ReplyCommentCommentHandler,
  FindAllCommentForUserQueryHandler,
  FindOneCommentQueryHandler,
  DeleteCommentCommandHandler,
  UpdateCommentContentCommandHandler,
  DeleteCommentHandler,
  UpdateCommentContentHandler
];

@Module({
  imports: [CqrsModule, AuthModule],
  controllers: [CommentController],
  providers: [...application, ...infrastructure, ...domain],
  exports: [...infrastructure, ...domain]
})
export class CommentModule {}
