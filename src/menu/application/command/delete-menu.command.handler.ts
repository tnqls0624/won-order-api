import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CacheService } from 'src/cache/service/cache.service';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { InjectionToken } from '../Injection-token';
import { DeleteMenuCommand } from './delete-menu.command';

@CommandHandler(DeleteMenuCommand)
export class DeleteMenuCommandHandler
  implements ICommandHandler<DeleteMenuCommand>
{
  constructor(
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.MENU_REPOSITORY)
    private readonly menuRepository: MenuRepository
  ) {}

  async execute(command: DeleteMenuCommand) {
    const { admin, id } = command;
    const menu = await this.menuRepository.findById(id);
    if (!menu) throw new CustomError(RESULT_CODE.NOT_FOUND_MENU);
    await this.cacheService.delMenuCache(admin.market_id);
    menu.delete();
    return true;
  }
}
