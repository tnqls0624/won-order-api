import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { InjectionToken } from '../Injection-token';
import { UpdateMenuOptionTlCommand } from './update-menu-option-tl.command';

@CommandHandler(UpdateMenuOptionTlCommand)
export class UpdateMenuOptionTlCommandHandler
  implements ICommandHandler<UpdateMenuOptionTlCommand>
{
  constructor(
    @Inject(InjectionToken.MENU_REPOSITORY)
    private readonly menuRepository: MenuRepository
  ) {}

  async execute(command: UpdateMenuOptionTlCommand) {
    const { body } = command;
    await this.menuRepository.updateMenuOptionTl(body);
    return true;
  }
}
