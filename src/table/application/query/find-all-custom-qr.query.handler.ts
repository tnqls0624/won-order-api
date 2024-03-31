import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { TableQuery } from './table.query';
import { FindAllCustomQRQuery } from './find-all-custom-qr.query';

@QueryHandler(FindAllCustomQRQuery)
export class FindAllCustomQRQueryHandler
  implements IQueryHandler<FindAllCustomQRQuery>
{
  constructor(
    @Inject(InjectionToken.TABLE_QUERY)
    readonly tableQuery: TableQuery
  ) {}

  async execute(query: FindAllCustomQRQuery) {
    const { admin, page_options } = query;
    return this.tableQuery.findAllCustomQR(admin.market_id, page_options);
  }
}
