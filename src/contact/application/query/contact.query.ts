import { PageOptionsDto } from '../../../utils/paginate/dto';
import { ContactStatus } from '../../../types/contact.type';

export interface ContactQuery {
  findAll: (
    status: ContactStatus | null,
    page_options: PageOptionsDto
  ) => Promise<any | null>;
  findById: (id: number) => Promise<any | null>;
}
