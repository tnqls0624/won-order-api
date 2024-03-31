import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/auth/auth.module';
import { InjectionToken } from './application/Injection-token';
import { NoticeRepositoryImplement } from './infrastructure/repository/notice.repository.implement';
import { NoticeFactory } from './domain/notice.factory';
import { CreateNoticeCommandHandler } from './application/command/create-notice-command.handler';
import { NoticeController } from './interface/notice.controller';
import { NoticeDomainService } from './domain/notice.domain.service';
import { DeleteNoticeCommandHandler } from './application/command/delete-notice-command.handler';
import { DeleteNoticeHandler } from './application/event/delete-notice.handler';
import { FindAllNoticeQueryHandler } from './application/query/find-all-notice-query.handler';
import { NoticeQueryImplement } from './infrastructure/query/notice.query.implement';
import { UpdateNoticeHandler } from './application/event/update-notice.handler';
import { UpdateNoticeCommandHandler } from './application/command/update-notice-command.handler';
import { FindNoticeQueryHandler } from './application/query/find-notice-query.handler';
import { FindAllNoticeForUserQueryHandler } from './application/query/find-all-notice-for-user.query.handler';
import { UpdateNoticeIndexHandler } from './application/event/update-notice-index.handler';
import { UpdateNoticeIndexCommandHandler } from './application/command/update-notice-index-command.handler';
import { UploadImageCommandHandler } from './application/command/upload-image-command.handler';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.NOTICE_REPOSITORY,
    useClass: NoticeRepositoryImplement
  },
  {
    provide: InjectionToken.NOTICE_QUERY,
    useClass: NoticeQueryImplement
  },
  {
    provide: InjectionToken.NOTICE_FACTORY,
    useClass: NoticeFactory
  }
];

const domain = [NoticeDomainService, NoticeFactory];

const application = [
  CreateNoticeCommandHandler,
  DeleteNoticeCommandHandler,
  UpdateNoticeCommandHandler,
  UpdateNoticeIndexCommandHandler,
  DeleteNoticeHandler,
  FindAllNoticeQueryHandler,
  FindAllNoticeForUserQueryHandler,
  UpdateNoticeIndexHandler,
  FindNoticeQueryHandler,
  UpdateNoticeHandler,
  UploadImageCommandHandler
];

@Module({
  imports: [CqrsModule, AuthModule],
  controllers: [NoticeController],
  providers: [...application, ...infrastructure, ...domain],
  exports: [...infrastructure, ...domain]
})
export class NoticeModule {}
