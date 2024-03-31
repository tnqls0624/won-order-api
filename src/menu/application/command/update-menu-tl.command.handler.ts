import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { InjectionToken } from '../Injection-token';
import { UpdateMenuTlCommand } from './update-menu-tl.command';

@CommandHandler(UpdateMenuTlCommand)
export class UpdateMenuTlCommandHandler
  implements ICommandHandler<UpdateMenuTlCommand>
{
  constructor(
    @Inject(InjectionToken.MENU_REPOSITORY)
    private readonly menuRepository: MenuRepository
  ) {}

  async execute(command: UpdateMenuTlCommand) {
    const { body } = command;
    await this.menuRepository.updateMenuTl(body);
    return true;
  }
}
