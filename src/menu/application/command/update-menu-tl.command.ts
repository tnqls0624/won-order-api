import { ICommand } from '@nestjs/cqrs';
import { UpdateMenuTlsDto } from 'src/menu/interface/dto/update-menu-tl.dto';

export class UpdateMenuTlCommand implements ICommand {
  constructor(readonly body: UpdateMenuTlsDto) {}
}
