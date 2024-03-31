import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { InjectionToken } from '../Injection-token';
import { UpdateMenuOptionCategoryTlCommand } from './update-menu-option-category-tl.command';

@CommandHandler(UpdateMenuOptionCategoryTlCommand)
export class UpdateMenuOptionCategoryTlCommandHandler
  implements ICommandHandler<UpdateMenuOptionCategoryTlCommand>
{
  constructor(
    @Inject(InjectionToken.MENU_REPOSITORY)
    private readonly menuRepository: MenuRepository
  ) {}

  async execute(command: UpdateMenuOptionCategoryTlCommand) {
    const { body } = command;
    await this.menuRepository.updateMenuOptionCategoryTl(body);
    return true;
  }
}
