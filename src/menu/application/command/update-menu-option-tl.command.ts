import { ICommand } from '@nestjs/cqrs';
import { UpdateMenuOptionTlsDto } from 'src/menu/interface/dto/update-menu-option-tl.dto';

export class UpdateMenuOptionTlCommand implements ICommand {
  constructor(readonly body: UpdateMenuOptionTlsDto) {}
}
