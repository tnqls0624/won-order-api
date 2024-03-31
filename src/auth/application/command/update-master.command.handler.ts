import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminRepository } from 'src/auth/domain/admin.repository';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/password.module';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { UpdateMasterCommand } from './update-master.command';
import { AdminQuery } from '../query/admin.query';
import { AdminType } from 'src/types/login.type';

@CommandHandler(UpdateMasterCommand)
export class UpdateMasterCommandHandler
  implements ICommandHandler<UpdateMasterCommand>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository,
    @Inject(InjectionToken.ADMIN_QUERY)
    private readonly adminQuery: AdminQuery,
    @Inject(PASSWORD_GENERATOR)
    private readonly passwordGenerator: PasswordGenerator
  ) {}

  async execute(command: UpdateMasterCommand) {
    const { id, body } = command;
    const { password } = body;

    const admin = await this.adminRepository.findByMasterId(
      AdminType.MASTER,
      id
    );

    if (!admin) throw new CustomError(RESULT_CODE.NOT_FOUND_ADMIN);

    if (body.admin_id) {
      const duplicated_admin_id = await this.adminQuery.duplicatedIdCheck(
        AdminType.MASTER,
        body.admin_id
      );

      if (duplicated_admin_id)
        throw new CustomError(RESULT_CODE.DUPLICATED_ADMIN_ID);
    }

    if (body.password) {
      body.password = await this.passwordGenerator.generateHash(password);
    }

    admin.updateMaster(body);
    return true;
  }
}
