import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminRepository } from 'src/auth/domain/admin.repository';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { RESULT_CODE } from 'src/constant';
import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/password.module';
import { UpdateAdminPasswordCommand } from './update-admin-password.command';

@CommandHandler(UpdateAdminPasswordCommand)
export class UpdateAdminPasswordCommandHandler
  implements ICommandHandler<UpdateAdminPasswordCommand>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository,
    @Inject(PASSWORD_GENERATOR)
    private readonly passwordGenerator: PasswordGenerator
  ) {}

  async execute(command: UpdateAdminPasswordCommand) {
    const { admin: admin_dto, body } = command;
    const { id } = admin_dto;
    const { password } = body;
    if (!password) throw new NotFoundException(RESULT_CODE.AUTH_NEED_PASSWORD);
    const admin = await this.adminRepository.findById(id);
    if (!admin) throw new NotFoundException(RESULT_CODE.NOT_FOUND_USER);
    const hash = await this.passwordGenerator.generateHash(password);
    admin.updatePassword(hash);
    return true;
  }
}
