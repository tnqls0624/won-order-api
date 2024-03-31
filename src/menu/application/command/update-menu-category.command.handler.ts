import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CacheService } from 'src/cache/service/cache.service';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { MenuCategoryRepository } from 'src/menu/domain/menu-category.repository';
import { InjectionToken } from '../Injection-token';
import { UpdateMenuCategoryCommand } from './update-menu-category.command';

@CommandHandler(UpdateMenuCategoryCommand)
export class UpdateMenuCategoryCommandHandler
  implements ICommandHandler<UpdateMenuCategoryCommand>
{
  constructor(
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.MENUCATEGORY_REPOSITORY)
    private readonly menuCategoryRepository: MenuCategoryRepository
  ) {}

  async execute(command: UpdateMenuCategoryCommand) {
    const { admin, id, body } = command;
    const menu_category = await this.menuCategoryRepository.findById(id);
    if (!menu_category)
      throw new CustomError(RESULT_CODE.NOT_FOUND_MENU_CATEGORY);
    await this.cacheService.delMenuCache(admin.market_id);
    menu_category.update(admin.market_id, body);
    return true;
  }
}
