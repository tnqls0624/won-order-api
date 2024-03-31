import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { FindAllContactQuery } from './find-all-contact.query';
import { ContactQuery } from './contact.query';

@QueryHandler(FindAllContactQuery)
export class FindAllContactQueryHandler
  implements IQueryHandler<FindAllContactQuery>
{
  constructor(
    @Inject(InjectionToken.CONTACT_QUERY)
    readonly contactQuery: ContactQuery
  ) {}

  async execute(query: FindAllContactQuery) {
    const { status, page_options } = query;
    return this.contactQuery.findAll(status, page_options);
  }
}
