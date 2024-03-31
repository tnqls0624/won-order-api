import { ICommand } from '@nestjs/cqrs';
import { UpdateEmployeeDto } from 'src/auth/interface/dto/req/update-employee.dto';

export class UpdateEmployeeCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly body: UpdateEmployeeDto
  ) {}
}
