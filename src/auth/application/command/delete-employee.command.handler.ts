import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { RESULT_CODE } from 'src/constant';
import { DeleteEmployeeCommand } from './delete-employee.command';
import { AdminRepository } from 'src/auth/domain/admin.repository';

@CommandHandler(DeleteEmployeeCommand)
export class DeleteEmployeeCommandHandler
  implements ICommandHandler<DeleteEmployeeCommand, boolean>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository
  ) {}

  async execute(command: DeleteEmployeeCommand): Promise<boolean> {
    const { admin } = command;
    const domain = await this.adminRepository.findById(admin.id);
    if (!domain) throw new NotFoundException(RESULT_CODE.NOT_FOUND_ADMIN);
    domain.delete();
    return true;
  }
}
