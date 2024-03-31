import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CacheService } from 'src/cache/service/cache.service';
import { RESULT_CODE } from 'src/constant';
import { GroupRepository } from 'src/group/domain/group.repository';
import { InjectionToken } from '../injection-token';
import { UpdateGroupCommand } from './update-group.command';

@CommandHandler(UpdateGroupCommand)
export class UpdateGroupCommandHandler
  implements ICommandHandler<UpdateGroupCommand>
{
  constructor(
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepository
  ) {}

  async execute(command: UpdateGroupCommand) {
    const { admin, id, body } = command;
    const group = await this.groupRepository.findById(id);
    if (!group) throw new NotFoundException(RESULT_CODE.NOT_FOUND_GROUP);
    group.update(admin.market_id, body.name, body.content);
    await this.cacheService.delMenuCache(admin.market_id);
    return true;
  }
}
