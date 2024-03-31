import { forwardRef, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RequestSmsCommandHandler } from './application/command/request-sms.command.handler';
import { VerifySmsCommandHandler } from './application/command/verify-sms.command.handler';
import { VerificationController } from './interface/verification.controller';
import { DeleteVerificationEventHandler } from './application/event/delete-verification-event.handler';
import SMSApi from './infrastructure/sms_api';
import { InjectionToken } from './application/Injection-token';
import { TokenModule } from 'libs/token.module';
import { VerificationRepositoryImplement } from './infrastructure/repository/varification.repository.implement';
import { VerificationDomainService } from './domain/verification.domain.service';
import { VerificationFactory } from './domain/verification.factory';
import { RequestSmsEventHandler } from './application/event/request-sms-event.handler';
import { UpdateVerificationEventHandler } from './application/event/update-verification-event.handler';
import { AuthModule } from 'src/auth/auth.module';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.VERIFICATION_REPOSITORY,
    useClass: VerificationRepositoryImplement
  },
  {
    provide: InjectionToken.VERIFICATION_FACTORY,
    useClass: VerificationFactory
  }
];

const application = [
  RequestSmsCommandHandler,
  VerifySmsCommandHandler,
  RequestSmsEventHandler,
  UpdateVerificationEventHandler,
  DeleteVerificationEventHandler,
  SMSApi
];

const domain = [VerificationDomainService, VerificationFactory];
@Module({
  imports: [CqrsModule, TokenModule, forwardRef(() => AuthModule)],
  controllers: [VerificationController],
  providers: [...application, ...infrastructure, ...domain],
  exports: [...infrastructure]
})
export class VerificationModule {}
