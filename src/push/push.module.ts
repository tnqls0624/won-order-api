import { Module, Provider, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PushController } from './interface/push.controller';
import { InjectionToken } from './application/Injection-token';
import { PushRepositoryImplement } from './infrastructure/repository/push.repository.implement';
import { PushFactory } from './domain/push.factory';
import { PushDomainService } from './domain/push.domain.service';
import { AuthModule } from 'src/auth/auth.module';
import { RegistDeviceCommandHandler } from './application/command/regist-device.command.handler';
import { DevicePushEventHandler } from './application/event/device-push.handler';
import { EventModule } from 'src/event/event.module';
import { TableModule } from 'src/table/table.module';
import { DeliveryDevicePushEventHandler } from './application/event/delivery-device-push.handler';
import { GroupModule } from 'src/group/group.module';
import { RemoveDeviceCommandHandler } from './application/command/remove-device.command.handler';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.PUSH_REPOSITORY,
    useClass: PushRepositoryImplement
  },
  {
    provide: InjectionToken.PUSH_FACTORY,
    useClass: PushFactory
  }
];

const domain = [PushDomainService, PushFactory];

const application = [
  RegistDeviceCommandHandler,
  DevicePushEventHandler,
  DeliveryDevicePushEventHandler,
  RemoveDeviceCommandHandler
];

@Module({
  imports: [
    CqrsModule,
    AuthModule,
    forwardRef(() => EventModule),
    TableModule,
    GroupModule
  ],
  controllers: [PushController],
  providers: [...application, ...infrastructure, ...domain],
  exports: [...domain]
})
export class PushModule {}
