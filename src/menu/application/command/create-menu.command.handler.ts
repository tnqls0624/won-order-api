import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CacheService } from 'src/cache/service/cache.service';
import { MenuFactory } from 'src/menu/domain/menu.factory';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { MenuState } from 'src/menu/infrastructure/entity/menu.entity';
import { InjectionToken } from '../Injection-token';
import { CreateMenuCommand } from './create-menu.command';

@CommandHandler(CreateMenuCommand)
export class CreateMenuCommandHandler
  implements ICommandHandler<CreateMenuCommand>
{
  constructor(
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.MENU_REPOSITORY)
    private readonly menuRepository: MenuRepository,
    @Inject(InjectionToken.MENU_FACTOEY)
    private readonly menuFactory: MenuFactory
  ) {}

  async execute(command: CreateMenuCommand) {
    const { admin, body } = command;
    await this.cacheService.delMenuCache(admin.market_id);
    const menu = this.menuFactory.create({
      ...body.menu,
      state: MenuState.NORMAL,
      index: 0
    });
    return this.menuRepository.save(admin.market_id, menu);
  }
}
