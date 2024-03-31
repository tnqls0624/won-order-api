import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminFactory } from 'src/auth/domain/admin.factory';
import { AdminRepository } from 'src/auth/domain/admin.repository';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/password.module';
import { AdminType } from 'src/types/login.type';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { GroupRepository } from 'src/group/domain/group.repository';
import { CreateEmployeeCommand } from './create-employee.command';

@CommandHandler(CreateEmployeeCommand)
export class CreateEmployeeCommandHandler
  implements ICommandHandler<CreateEmployeeCommand>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository,
    @Inject(InjectionToken.GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepository,
    @Inject(InjectionToken.ADMIN_FACTORY)
    private readonly adminFactory: AdminFactory,
    @Inject(PASSWORD_GENERATOR)
    private readonly passwordGenerator: PasswordGenerator
  ) {}

  async execute(command: CreateEmployeeCommand) {
    const { body } = command;
    const { password, admin_id, nickname, market_id, select_ids } = body;
    if (!admin_id) throw new CustomError(RESULT_CODE.AUTH_NEED_ADMIN);
    if (!nickname) throw new CustomError(RESULT_CODE.AUTH_NEED_NAME);
    const hash = await this.passwordGenerator.generateHash(password);
    const admin_model = this.adminFactory.create({
      market_id,
      admin_id,
      language_id: 3,
      type: AdminType.EMPLOYEE,
      password: hash,
      nickname
    });
    const admin = await this.adminRepository.save(admin_model);
    if (!admin) throw new CustomError(RESULT_CODE.NOT_FOUND_ADMIN);
    await this.groupRepository.select(
      admin.id as number,
      admin.market_id,
      select_ids
    );
    return true;
  }
}
