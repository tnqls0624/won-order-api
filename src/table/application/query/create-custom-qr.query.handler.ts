import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { TableQuery } from './table.query';
import { CreateCustomQRQuery } from './create-custom-qr.query';
import CryptoJS from 'crypto-js';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';

@QueryHandler(CreateCustomQRQuery)
export class CreateCustomQRQueryHandler
  implements IQueryHandler<CreateCustomQRQuery>
{
  constructor(
    @Inject(InjectionToken.TABLE_QUERY)
    readonly tableQuery: TableQuery
  ) {}

  async execute(query: CreateCustomQRQuery) {
    const { admin, id } = query;
    const custom_qr = await this.tableQuery.findCustomQR(id);
    if (!custom_qr) throw new CustomError(RESULT_CODE.NOT_FOUND_CUSTOM_QR);

    const qr_code = {
      id: custom_qr.id,
      type: 'CUSTOM'
    };

    const qr_secret = CryptoJS.AES.encrypt(JSON.stringify(qr_code), 'soobeen')
      .toString()
      .replace(/\//g, '_');
    const mobile_url = `${process.env.WEB}/market/${admin.market_id}?code=${qr_secret}`;
    return mobile_url;
  }
}
