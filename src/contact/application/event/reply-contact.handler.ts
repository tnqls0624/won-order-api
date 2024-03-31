import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { ContactRepository } from '../../domain/contact.repository';
import { ReplyContactEvent } from '../../domain/event/reply-contact.event';

@EventsHandler(ReplyContactEvent)
export class ReplyContactHandler implements IEventHandler<ReplyContactEvent> {
  constructor(
    @Inject(InjectionToken.CONTACT_REPOSITORY)
    private readonly contactRepository: ContactRepository
  ) {}

  async handle(event: ReplyContactEvent) {
    const { id, body } = event;
    await this.contactRepository.update(id, body);
  }
}
