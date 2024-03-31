import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { TableQuery } from './table.query';
import { FindCustomQRQuery } from './find-custom-qr.query';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';

@QueryHandler(FindCustomQRQuery)
export class FindCustomQRQueryHandler
  implements IQueryHandler<FindCustomQRQuery>
{
  constructor(
    @Inject(InjectionToken.TABLE_QUERY)
    readonly tableQuery: TableQuery
  ) {}

  async execute(query: FindCustomQRQuery) {
    const { id } = query;
    const custom_qr = await this.tableQuery.findCustomQR(id);
    if (!custom_qr) {
      throw new CustomError(RESULT_CODE.NOT_FOUND_CUSTOM_QR);
    }
    return custom_qr;
  }
}
