import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { InjectionToken } from '../Injection-token';
import { TableQuery } from '../query/table.query';
import { TableRepository } from 'src/table/domain/table.repository';
import { UpdateCustomQRCommand } from './update-custom-qr.command';

@CommandHandler(UpdateCustomQRCommand)
export class UpdateCustomQRCommandHandler
  implements ICommandHandler<UpdateCustomQRCommand>
{
  constructor(
    @Inject(InjectionToken.TABLE_QUERY)
    private readonly tableQuery: TableQuery,
    @Inject(InjectionToken.TABLE_REPOSITORY)
    private readonly tableRepository: TableRepository
  ) {}

  async execute(command: UpdateCustomQRCommand) {
    const { admin, id, body } = command;
    const custom_qr = await this.tableQuery.findCustomQR(id);
    if (!custom_qr) throw new CustomError(RESULT_CODE.NOT_FOUND_CUSTOM_QR);
    const data = {
      ...body,
      market_id: admin.market_id
    };
    await this.tableRepository.updateCustomQR(custom_qr.id, data);
    return true;
  }
}
