import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { InjectionToken } from '../Injection-token';
import { UpdateMenuCategoryTlCommand } from './update-menu-category-tl.command';

@CommandHandler(UpdateMenuCategoryTlCommand)
export class UpdateMenuCategoryTlCommandHandler
  implements ICommandHandler<UpdateMenuCategoryTlCommand>
{
  constructor(
    @Inject(InjectionToken.MENU_REPOSITORY)
    private readonly menuRepository: MenuRepository
  ) {}

  async execute(command: UpdateMenuCategoryTlCommand) {
    const { body } = command;
    await this.menuRepository.updateMenuCategoryTl(body);
    return true;
  }
}
