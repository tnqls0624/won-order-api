import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { GroupDomainService } from 'src/group/domain/group.domain.service';
import { GroupRepository } from 'src/group/domain/group.repository';
import { GroupEntity } from 'src/group/infrastructure/entity/group.entity';
import { AdminType, LoginType } from 'src/types/login.type';
import { InjectionToken } from '../injection-token';
import { SelectGroupCommand } from './select-group.command';

@CommandHandler(SelectGroupCommand)
export class SelectGroupCommandHandler
  implements ICommandHandler<SelectGroupCommand>
{
  constructor(
    @Inject(InjectionToken.GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepository,
    @Inject(InjectionToken.GROUP_DOMAIN_SERVICE)
    private readonly groupDomainService: GroupDomainService
  ) {}

  async execute(command: SelectGroupCommand) {
    const { admin, body } = command;
    if (admin.type !== AdminType.EMPLOYEE)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);

    const select_group = await this.groupRepository.select(
      admin.id,
      admin.market_id,
      body.select_ids
    );
    if (select_group) {
      const now_admin = await this.groupDomainService.validateAdmin(
        LoginType.EMPLOYEE,
        admin.market_id,
        admin
      );
      if (!now_admin) throw new CustomError(RESULT_CODE.NOT_FOUND_ADMIN);
      const groups = await this.groupRepository.findAll(now_admin.market_id);
      if (!groups) throw new CustomError(RESULT_CODE.NOT_FOUND_GROUP);
      const admin_group_map: Map<number, boolean> = new Map();
      now_admin.admin_group.forEach((v) => {
        admin_group_map.set(v.group.id, v.selected ?? false);
      });

      const admin_group = groups.map((group: GroupEntity) => ({
        group: { id: group.id, name: group.name, content: group.content },
        selected: admin_group_map.get(group.id as number) ?? false
      }));

      return {
        ...now_admin,
        admin_group
      };
    }
    throw new CustomError(RESULT_CODE.SELECT_ERROR);
  }
}
