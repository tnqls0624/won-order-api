import { Inject } from '@nestjs/common';
import { AggregateRoot, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CacheService } from 'src/cache/service/cache.service';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { MenuCategoryRepository } from 'src/menu/domain/menu-category.repository';
import { InjectionToken } from '../Injection-token';
import { UpdateMenuCategoryIndexCommand } from './update-menu-category-index.command';

@CommandHandler(UpdateMenuCategoryIndexCommand)
export class UpdateMenuCategoryIndexCommandHandler
  extends AggregateRoot
  implements ICommandHandler<UpdateMenuCategoryIndexCommand>
{
  constructor(
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.MENUCATEGORY_REPOSITORY)
    private readonly menuCategoryRepository: MenuCategoryRepository
  ) {
    super();
  }

  async execute(command: UpdateMenuCategoryIndexCommand) {
    const { admin, body } = command;
    await Promise.all(
      body.menu_category.map(async (item) => {
        if (!item.id)
          throw new CustomError(RESULT_CODE.NOT_FOUND_MENU_CATEGORY);
        const menu_category = await this.menuCategoryRepository.findById(
          item.id
        );
        if (!menu_category)
          throw new CustomError(RESULT_CODE.NOT_FOUND_MENU_CATEGORY);
        menu_category.updateIndex(item.index);
      })
    );
    await this.cacheService.delMenuCache(admin.market_id);
    return true;
  }
}
