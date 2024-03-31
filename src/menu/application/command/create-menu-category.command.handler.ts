import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CacheService } from 'src/cache/service/cache.service';
import { MenuCategoryFactory } from 'src/menu/domain/menu-category.factory';
import { MenuCategoryRepository } from 'src/menu/domain/menu-category.repository';
import { InjectionToken } from '../Injection-token';
import { CreateMenuCategoryCommand } from './create-menu-category.command';

@CommandHandler(CreateMenuCategoryCommand)
export class CreateMenuCategoryCommandHandler
  implements ICommandHandler<CreateMenuCategoryCommand>
{
  constructor(
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.MENUCATEGORY_REPOSITORY)
    private readonly menuCategoryRepository: MenuCategoryRepository,
    @Inject(InjectionToken.MENU_CATEGORY_FACTORY)
    private readonly menuCategoryFactory: MenuCategoryFactory
  ) {}

  async execute(command: CreateMenuCategoryCommand) {
    const { admin, body } = command;
    const menu_category = this.menuCategoryFactory.create({
      market_id: admin.market_id,
      ...body,
      index: 1
    });
    await this.cacheService.delMenuCache(admin.market_id);
    return this.menuCategoryRepository.save(
      admin.market_id,
      body.group_id,
      menu_category
    );
  }
}
