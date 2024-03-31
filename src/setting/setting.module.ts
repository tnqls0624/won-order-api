import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/auth/auth.module';
import { UpdateSettingCommandHandler } from './application/command/update-setting.command.handler';
import { SettingController } from './interface/setting.controller';
import { InjectionToken } from './application/Injection-token';
import { SettingRepositoryImplement } from './infrastructure/repository/setting.repository.implement';
import { SettingDomainService } from './domain/setting.domain.service';
import { SettingFactory } from './domain/setting.factory';
import { SettingQueryImplement } from './infrastructure/query/setting.query.implement';
import { UpdateSettingEventHandler } from './application/event/update-setting.handler';
import { FindSettingQueryHandler } from './application/query/find-setting.query.handler';
import { CacheStoreModule } from 'src/cache/cache.module';
import { UploadLogoImageCommandHandler } from './application/command/upload-logo-image.command.handler';
import { LogoRepositoryImplement } from './infrastructure/repository/logo.repository.implement';
import { LogoFactory } from './domain/logo.factory';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.SETTING_REPOSITORY,
    useClass: SettingRepositoryImplement
  },
  {
    provide: InjectionToken.SETTING_QUERY,
    useClass: SettingQueryImplement
  },
  {
    provide: InjectionToken.LOGO_REPOSITORY,
    useClass: LogoRepositoryImplement
  },
  {
    provide: InjectionToken.LOGO_FACTORY,
    useClass: LogoFactory
  },
  {
    provide: InjectionToken.SETTING_FACTORY,
    useClass: SettingFactory
  }
];

const domain = [SettingDomainService, SettingFactory, LogoFactory];

const application = [
  UpdateSettingCommandHandler,
  FindSettingQueryHandler,
  UpdateSettingEventHandler,
  UploadLogoImageCommandHandler
];
@Module({
  imports: [CqrsModule, AuthModule, CacheStoreModule],
  controllers: [SettingController],
  providers: [...application, ...infrastructure, ...domain],
  exports: [...infrastructure, ...domain]
})
export class SettingModule {}
