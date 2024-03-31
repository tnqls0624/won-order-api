import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TableRepository } from 'src/table/domain/table.repository';
import { InjectionToken } from '../Injection-token';
import { CreateCustomQRCommand } from './create-custom-qr.command';

@CommandHandler(CreateCustomQRCommand)
export class CreateCustomQRCommandHandler
  implements ICommandHandler<CreateCustomQRCommand>
{
  constructor(
    @Inject(InjectionToken.TABLE_REPOSITORY)
    private readonly tableRepository: TableRepository
  ) {}

  async execute(command: CreateCustomQRCommand) {
    const { admin, body } = command;
    const custom_qr_body = {
      ...body,
      market_id: admin.market_id
    };
    await this.tableRepository.customQRSave(custom_qr_body);
  }
}
