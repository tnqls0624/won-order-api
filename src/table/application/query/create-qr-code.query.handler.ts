import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { TableRepository } from 'src/table/domain/table.repository';
import { InjectionToken } from '../Injection-token';
import { CreateQRCodeQuery } from './create-qr-code.query';

@QueryHandler(CreateQRCodeQuery)
export class CreateQRCodeQueryHandler
  implements IQueryHandler<CreateQRCodeQuery>
{
  constructor(
    @Inject(InjectionToken.TABLE_REPOSITORY)
    readonly tableReposiotry: TableRepository
  ) {}

  async execute(query: CreateQRCodeQuery) {
    const { admin, id } = query;
    const table = await this.tableReposiotry.findById(id);
    if (!table) throw new CustomError(RESULT_CODE.NOT_FOUND_TABLE);
    const qr_url = await table.createQRCode(admin.market_id);
    return qr_url;
  }
}
