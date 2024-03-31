import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { FindContactQuery } from './find-contact-query';
import { ContactQuery } from './contact.query';

@QueryHandler(FindContactQuery)
export class FindContactQueryHandler
  implements IQueryHandler<FindContactQuery>
{
  constructor(
    @Inject(InjectionToken.CONTACT_QUERY)
    readonly contactQuery: ContactQuery
  ) {}

  async execute(query: FindContactQuery) {
    return this.contactQuery.findById(query.id);
  }
}
