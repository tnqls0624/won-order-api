import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { AdminRepository } from 'src/auth/domain/admin.repository';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { DeleteAdminCommand } from './delete-admin.command';

@CommandHandler(DeleteAdminCommand)
export class DeleteAdminCommandHandler
  implements ICommandHandler<DeleteAdminCommand>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository
  ) {}

  async execute(command: DeleteAdminCommand) {
    const { id } = command;
    const admin = await this.adminRepository.findById(id);
    if (!admin) throw new CustomError(RESULT_CODE.NOT_FOUND_ADMIN);
    admin.delete();
    return true;
  }
}
