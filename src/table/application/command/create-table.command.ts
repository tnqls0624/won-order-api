import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { CreateTableDto } from '../../interface/dto/create-table.dto';

export class CreateTableCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly body: CreateTableDto
  ) {}
}
