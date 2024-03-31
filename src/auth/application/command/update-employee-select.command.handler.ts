import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { AdminRepository } from 'src/auth/domain/admin.repository';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { GroupRepository } from 'src/group/domain/group.repository';
import { UpdateEmployeeSelectCommand } from './update-employee-select.command';
import { UpdateEmployeeDto } from 'src/auth/interface/dto/req/update-employee.dto';

@CommandHandler(UpdateEmployeeSelectCommand)
export class UpdateEmployeeSelectCommandHandler
  implements ICommandHandler<UpdateEmployeeSelectCommand>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository,
    @Inject(InjectionToken.GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepository
  ) {}

  async execute(command: UpdateEmployeeSelectCommand) {
    const { id, admin, body } = command;
    const { select_ids } = body;
    const admin_model = await this.adminRepository.findById(id);
    if (!admin_model) throw new CustomError(RESULT_CODE.NOT_FOUND_ADMIN);

    admin_model.update(new UpdateEmployeeDto(body.nickname, body.language));
    await this.groupRepository.select(id, admin.market_id, select_ids);
    return true;
  }
}
