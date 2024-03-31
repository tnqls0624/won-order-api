import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CacheService } from 'src/cache/service/cache.service';
import { RESULT_CODE } from 'src/constant';
import { GroupRepository } from 'src/group/domain/group.repository';
import { InjectionToken } from '../injection-token';
import { DeleteGroupCommand } from './delete-group.command';

@CommandHandler(DeleteGroupCommand)
export class DeleteGroupCommandHandler
  implements ICommandHandler<DeleteGroupCommand>
{
  constructor(
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepository
  ) {}

  async execute(command: DeleteGroupCommand) {
    const { admin, id } = command;
    const group = await this.groupRepository.findById(id);
    if (!group) throw new NotFoundException(RESULT_CODE.NOT_FOUND_GROUP);
    group.delete();
    await this.cacheService.delMenuCache(admin.market_id);
    return true;
  }
}
