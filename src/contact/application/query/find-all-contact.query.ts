import { IQuery } from '@nestjs/cqrs';
import { PageOptionsDto } from '../../../utils/paginate/dto';
import { ContactStatus } from '../../../types/contact.type';

export class FindAllContactQuery implements IQuery {
  constructor(
    readonly status: ContactStatus | null,
    readonly page_options: PageOptionsDto
  ) {}
}
