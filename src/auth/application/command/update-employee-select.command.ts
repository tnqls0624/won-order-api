import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from '../../interface/dto/model/admin.dto';
import { UpdateEmployeeSelectDto } from 'src/auth/interface/dto/req/update-employee-select.dto';

export class UpdateEmployeeSelectCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly id: number,
    readonly body: UpdateEmployeeSelectDto
  ) {}
}
