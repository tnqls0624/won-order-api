import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/auth/auth.module';
import { InjectionToken } from './application/Injection-token';
import { CreateContactCommandHandler } from './application/command/create-contact-command.handler';
import { ContactFactory } from './domain/contact.factory';
import { ContactRepositoryImplement } from './infrastructure/repository/contact.repository.implement';
import { ContactDomainService } from './domain/contact.domain.service';
import { ContactController } from './interface/contact.controller';
import { ReplyContactCommandHandler } from './application/command/reply-contact-command.handler';
import { ReplyContactHandler } from './application/event/reply-contact.handler';
import { ContactQueryImplement } from './infrastructure/query/contact.query.implement';
import { FindContactQueryHandler } from './application/query/find-contact-query.handler';
import { FindAllContactQueryHandler } from './application/query/find-all-contact-query.handler';
import { MessageModule } from '../../libs/message.module';
import { ReplyContactMailSendHandler } from './application/event/reply-contact-mail-send.handler';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.CONTACT_REPOSITORY,
    useClass: ContactRepositoryImplement
  },
  {
    provide: InjectionToken.CONTACT_QUERY,
    useClass: ContactQueryImplement
  },
  {
    provide: InjectionToken.CONTACT_FACTORY,
    useClass: ContactFactory
  }
];

const domain = [ContactDomainService, ContactFactory];

const application = [
  CreateContactCommandHandler,
  ReplyContactCommandHandler,
  ReplyContactHandler,
  FindContactQueryHandler,
  FindAllContactQueryHandler,
  ReplyContactMailSendHandler
];

@Module({
  imports: [CqrsModule, AuthModule, MessageModule],
  controllers: [ContactController],
  providers: [...application, ...infrastructure, ...domain],
  exports: [...infrastructure, ...domain]
})
export class ContactModule {}
