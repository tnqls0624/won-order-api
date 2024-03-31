import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReplyContactMailSendEvent } from '../../domain/event/reply-contact-mail-send.event';
import {
  INTEGRATION_SES_PUBLISHER,
  IntegrationSESPublisher
} from '../../../../libs/message.module';
import { Inject } from '@nestjs/common';

@EventsHandler(ReplyContactMailSendEvent)
export class ReplyContactMailSendHandler
  implements IEventHandler<ReplyContactMailSendEvent>
{
  constructor(
    @Inject(INTEGRATION_SES_PUBLISHER)
    private readonly sesPublisher: IntegrationSESPublisher
  ) {}

  async handle(event: ReplyContactMailSendEvent) {
    await this.sesPublisher.publish(event.email, event.title, event.content);
  }
}
