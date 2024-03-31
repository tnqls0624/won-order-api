import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminFactory } from 'src/auth/domain/admin.factory';
import { AdminRepository } from 'src/auth/domain/admin.repository';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/password.module';
import { AdminType } from 'src/types/login.type';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { CreateMasterCommand } from './create-master.command';
import { AdminQuery } from '../query/admin.query';

@CommandHandler(CreateMasterCommand)
export class CreateMasterCommandHandler
  implements ICommandHandler<CreateMasterCommand>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository,
    @Inject(InjectionToken.ADMIN_QUERY)
    private readonly adminQuery: AdminQuery,
    @Inject(InjectionToken.ADMIN_FACTORY)
    private readonly adminFactory: AdminFactory,
    @Inject(PASSWORD_GENERATOR)
    private readonly passwordGenerator: PasswordGenerator
  ) {}

  async execute(command: CreateMasterCommand) {
    const { body } = command;
    const { password, admin_id, nickname, market_id } = body;
    if (!admin_id) throw new CustomError(RESULT_CODE.AUTH_NEED_ADMIN);
    if (!nickname) throw new CustomError(RESULT_CODE.AUTH_NEED_NAME);
    if (!password) throw new CustomError(RESULT_CODE.AUTH_NEED_PASSWORD);

    const duplicated_name = await this.adminQuery.duplicatedIdCheck(
      AdminType.MASTER,
      body.admin_id
    );
    if (duplicated_name) throw new CustomError(RESULT_CODE.DUPLICATED_ADMIN_ID);
    const duplicated_admin = await this.adminQuery.duplicatedAdminCheck(
      AdminType.MASTER,
      body.market_id as number
    );
    if (duplicated_admin)
      throw new CustomError(RESULT_CODE.ALREADY_CAREATE_ADMIN);
    const hash = await this.passwordGenerator.generateHash(password);
    const admin_model = this.adminFactory.create({
      market_id,
      admin_id,
      language_id: 3,
      type: AdminType.MASTER,
      password: hash,
      nickname
    });
    const admin = await this.adminRepository.save(admin_model);
    if (!admin) throw new CustomError(RESULT_CODE.NOT_FOUND_ADMIN);
    return true;
  }
}
