import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Contact, ContactProperties } from './contact';
import { ContactStatus } from '../../types/contact.type';
import { ContactImplement } from './contact';

type CreateContactOptions = Readonly<{
  name: string;
  company: string;
  phone: string;
  email: string;
  content: string;
  processor: number | null;
  answer_content: string | null;
  answer_title: string | null;
  status: ContactStatus;
}>;

export class ContactFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateContactOptions): Contact {
    return this.eventPublisher.mergeObjectContext(
      new ContactImplement({
        ...options,
        remove_at: null,
        create_at: new Date(),
        update_at: new Date()
      })
    );
  }

  reconstitute(properties: ContactProperties): Contact {
    return this.eventPublisher.mergeObjectContext(
      new ContactImplement(properties)
    );
  }
}
