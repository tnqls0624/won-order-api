import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { TableRepository } from 'src/table/domain/table.repository';
import { InjectionToken } from '../Injection-token';
import { DeleteTableCommand } from './delete-table.command';

@CommandHandler(DeleteTableCommand)
export class DeleteTableCommandHandler
  implements ICommandHandler<DeleteTableCommand>
{
  constructor(
    @Inject(InjectionToken.TABLE_REPOSITORY)
    private readonly tableRepository: TableRepository
  ) {}

  async execute(command: DeleteTableCommand) {
    const { id } = command;
    const table = await this.tableRepository.findById(id);
    if (!table) throw new CustomError(RESULT_CODE.NOT_FOUND_TABLE);
    table.delete();
    return true;
  }
}
