import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { InjectionToken } from '../Injection-token';
import { DeleteCustomQRCommand } from './delete-custom-qr.command';
import { TableQuery } from '../query/table.query';
import { TableRepository } from 'src/table/domain/table.repository';

@CommandHandler(DeleteCustomQRCommand)
export class DeleteCustomQRCommandHandler
  implements ICommandHandler<DeleteCustomQRCommand>
{
  constructor(
    @Inject(InjectionToken.TABLE_QUERY)
    private readonly tableQuery: TableQuery,
    @Inject(InjectionToken.TABLE_REPOSITORY)
    private readonly tableRepository: TableRepository
  ) {}

  async execute(command: DeleteCustomQRCommand) {
    const { id } = command;
    const custom_qr = await this.tableQuery.findCustomQR(id);
    if (!custom_qr) throw new CustomError(RESULT_CODE.NOT_FOUND_CUSTOM_QR);
    await this.tableRepository.deleteCustomQR(custom_qr.id);
    return true;
  }
}
