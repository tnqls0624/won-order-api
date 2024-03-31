import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { RESULT_CODE } from 'src/constant';
import { AdminRepository } from 'src/auth/domain/admin.repository';
import { UpdateEmployeeCommand } from './update-employee.command';

@CommandHandler(UpdateEmployeeCommand)
export class UpdateEmployeeCommandHandler
  implements ICommandHandler<UpdateEmployeeCommand>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository
  ) {}

  async execute(command: UpdateEmployeeCommand) {
    const { id, body } = command;
    const employee = await this.adminRepository.findById(id);
    if (!employee) throw new NotFoundException(RESULT_CODE.NOT_FOUND_USER);
    employee.update(body);
    return true;
  }
}
