import { Contact } from './contact';
import { ContactEntity } from '../infrastructure/entity/contact.entity';

export interface ContactRepository {
  save: (data: Contact) => Promise<ContactEntity | null>;
  update: (id: number, body: Contact) => Promise<boolean>;
  findById: (id: number) => Promise<Contact | null>;
}
