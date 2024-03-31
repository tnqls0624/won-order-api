import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CacheService } from 'src/cache/service/cache.service';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { InjectionToken } from '../Injection-token';
import { UpdateMenuCommand } from './update-menu.command';

@CommandHandler(UpdateMenuCommand)
export class UpdateMenuCommandHandler
  implements ICommandHandler<UpdateMenuCommand>
{
  constructor(
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.MENU_REPOSITORY)
    private readonly menuRepository: MenuRepository
  ) {}

  async execute(command: UpdateMenuCommand) {
    const { admin, id, body } = command;
    const menu = await this.menuRepository.findById(id);
    if (!menu) throw new CustomError(RESULT_CODE.NOT_FOUND_MENU);
    await this.cacheService.delMenuCache(admin.market_id);
    menu.update(admin.market_id, body);
    return true;
  }
}
