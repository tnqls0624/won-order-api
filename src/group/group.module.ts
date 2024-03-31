import { forwardRef, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/auth/auth.module';
import { CreateGroupCommandHandler } from './application/command/create-group.command.handler';
import { DeleteGroupCommandHandler } from './application/command/delete-group.command.handler';
import { UpdateGroupCommandHandler } from './application/command/update-group.command.handler';
import { GroupController } from './interface/group.controller';
import { FindAllGroupQueryHandler } from './application/query/find-all-group.query.handler';
import { FindGroupQueryHandler } from './application/query/find-group.query.handler';
import { InjectionToken } from './application/injection-token';
import { GroupRepositoryImplement } from './infrastructure/repository/group.repository.implement';
import { GroupFactory } from './domain/group.factory';
import { GroupDomainService } from './domain/group.domain.service';
import { SelectGroupCommandHandler } from './application/command/select-group.command.handler';
import { GroupQueryImplement } from './infrastructure/query/group.query.implement';
import { DeleteGroupHandler } from './application/event/delete-group.handler';
import { UpdateGroupHandler } from './application/event/update-group.handler';
import { SettingModule } from 'src/setting/setting.module';
import { TranslateModule } from 'libs/translate.module';
import { CacheStoreModule } from 'src/cache/cache.module';
import { FindGroupTlQueryHandler } from './application/query/find-group-tl.query.handler';
import { UpdateGroupTlCommandHandler } from './application/command/update-group-tl.command.handler';
import { SettingFactory } from 'src/setting/domain/setting.factory';
import { FindAllGroupUserQueryHandler } from './application/query/find-all-group-user.query.handler';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.GROUP_REPOSITORY,
    useClass: GroupRepositoryImplement
  },
  {
    provide: InjectionToken.GROUP_QUERY,
    useClass: GroupQueryImplement
  },
  {
    provide: InjectionToken.GROUP_FACTORY,
    useClass: GroupFactory
  },
  {
    provide: InjectionToken.SETTING_FACTORY,
    useClass: SettingFactory
  },
  {
    provide: InjectionToken.GROUP_DOMAIN_SERVICE,
    useClass: GroupDomainService
  }
];

const domain = [GroupDomainService, GroupFactory];

const application = [
  CreateGroupCommandHandler,
  FindAllGroupQueryHandler,
  FindAllGroupUserQueryHandler,
  UpdateGroupCommandHandler,
  FindGroupQueryHandler,
  DeleteGroupCommandHandler,
  SelectGroupCommandHandler,
  DeleteGroupHandler,
  UpdateGroupHandler,
  FindGroupTlQueryHandler,
  UpdateGroupTlCommandHandler
];

@Module({
  imports: [
    CqrsModule,
    forwardRef(() => AuthModule),
    forwardRef(() => SettingModule),
    TranslateModule,
    CacheStoreModule
  ],
  controllers: [GroupController],
  providers: [...application, ...infrastructure, ...domain],
  exports: [...infrastructure]
})
export class GroupModule {}
