import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from '../../interface/dto/model/admin.dto';

export class DeleteEmployeeCommand implements ICommand {
  constructor(readonly admin: AdminDto) {}
}
