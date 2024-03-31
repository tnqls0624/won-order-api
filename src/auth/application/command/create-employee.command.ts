import { ICommand } from '@nestjs/cqrs';
import { CreateEmployeeDto } from 'src/auth/interface/dto/req/create-employee.dto';

export class CreateEmployeeCommand implements ICommand {
  constructor(readonly body: CreateEmployeeDto) {}
}
