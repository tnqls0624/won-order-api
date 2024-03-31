import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { DocumentQuery } from './document.query';
import { FindDocumentQuery } from './find-document.query';

@QueryHandler(FindDocumentQuery)
export class FindDocumentQueryHandler
  implements IQueryHandler<FindDocumentQuery>
{
  constructor(
    @Inject(InjectionToken.DOCUMENT_QUERY)
    readonly documentQuery: DocumentQuery
  ) {}

  async execute(query: FindDocumentQuery) {
    const { id } = query;
    return this.documentQuery.findById(id);
  }
}
