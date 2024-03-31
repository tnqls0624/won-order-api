import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TableFactory } from 'src/table/domain/table.factory';
import { TableRepository } from 'src/table/domain/table.repository';
import { InjectionToken } from '../Injection-token';
import { CreateTableCommand } from './create-table.command';
import { v4 as uuid } from 'uuid';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';

@CommandHandler(CreateTableCommand)
export class CreateTableCommandHandler
  implements ICommandHandler<CreateTableCommand>
{
  constructor(
    @Inject(InjectionToken.TABLE_REPOSITORY)
    private readonly tableRepository: TableRepository,
    @Inject(InjectionToken.TABLE_FACTORY)
    private readonly tableFactory: TableFactory
  ) {}

  async execute(command: CreateTableCommand) {
    const { admin, body } = command;
    const check_table_num = await this.tableRepository.findTableByTableNum(
      body.group_id,
      body.table_num
    );
    if (check_table_num) throw new CustomError(RESULT_CODE.DUPLICATED_TABLE);
    const code = uuid();
    const table = this.tableFactory.create({
      market_id: admin.market_id,
      ...body,
      code
    });
    return this.tableRepository.save(table);
  }
}
