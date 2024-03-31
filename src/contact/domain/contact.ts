import { AggregateRoot } from '@nestjs/cqrs';
import { ContactStatus } from '../../types/contact.type';
import { ReplyContactDto } from '../interface/dto/reply-contact.dto';
import { ReplyContactEvent } from './event/reply-contact.event';
import { ReplyContactMailSendEvent } from './event/reply-contact-mail-send.event';

export type ContactEssentialProperties = Readonly<
  Required<{
    name: string;
    company: string;
    phone: string;
    email: string;
    content: string;
    status: ContactStatus;
  }>
>;

export type ContactOptionalProperties = Readonly<
  Partial<{
    processor: number | null;
    answer_content: string | null;
    answer_title: string | null;
    create_at: Date;
    update_at: Date;
    remove_at: Date | null;
  }>
>;

export type ContactProperties = ContactEssentialProperties &
  Required<ContactOptionalProperties>;

export interface Contact {
  reply: (body: ReplyContactDto, processor: number) => void;
}

export class ContactImplement extends AggregateRoot implements Contact {
  private readonly id: number;
  private readonly name: string;
  private readonly company: string;
  private readonly phone: string;
  private readonly email: string;
  private answer_content: string | null;
  private answer_title: string | null;
  private processor: number | null;
  private status: ContactStatus;
  private readonly content: string;
  private create_at: Date;
  private update_at: Date;
  private remove_at: Date | null;

  constructor(properties: ContactProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }

  reply(body: ReplyContactDto, processor: number): void {
    this.answer_content = body.content;
    this.answer_title = body.title;
    this.processor = processor;
    this.status = ContactStatus.COMPLETE;
    this.apply(new ReplyContactEvent(this.id, this));
    this.apply(
      new ReplyContactMailSendEvent(
        this.email,
        this.answer_content,
        this.answer_title
      )
    );
  }
}
