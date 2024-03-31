import { BaseEntity } from './base.entity';
import { ContactStatus } from '../../../types/contact.type';

export class ContactEntity extends BaseEntity {
  name: string;
  company: string;
  phone: string;
  email: string;
  content: string;
  processor: number | null;
  answer_content: string | null;
  answer_title: string | null;
  status: ContactStatus;
}
