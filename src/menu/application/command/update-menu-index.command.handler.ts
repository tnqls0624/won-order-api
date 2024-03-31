import { Inject } from '@nestjs/common';
import { AggregateRoot, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CacheService } from 'src/cache/service/cache.service';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { InjectionToken } from '../Injection-token';
import { UpdateMenuIndexCommand } from './update-menu-index.command';

@CommandHandler(UpdateMenuIndexCommand)
export class UpdateMenuIndexCommandHandler
  extends AggregateRoot
  implements ICommandHandler<UpdateMenuIndexCommand>
{
  constructor(
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.MENU_REPOSITORY)
    private readonly menuRepository: MenuRepository
  ) {
    super();
  }

  async execute(command: UpdateMenuIndexCommand) {
    const { admin, body } = command;
    await Promise.all(
      body.menu.map(async (item) => {
        if (!item.id) throw new CustomError(RESULT_CODE.NOT_FOUND_MENU);
        const menu = await this.menuRepository.findById(item.id);
        if (!menu) throw new CustomError(RESULT_CODE.NOT_FOUND_MENU);
        menu.updateIndex(item.index);
      })
    );
    await this.cacheService.delMenuCache(admin.market_id);
    return true;
  }
}
