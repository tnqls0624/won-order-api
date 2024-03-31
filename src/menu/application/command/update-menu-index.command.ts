import { ICommand } from '@nestjs/cqrs';
import { UpdateMenuIndexesDto } from 'src/menu/interface/dto/update-menu-index.dto';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class UpdateMenuIndexCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly body: UpdateMenuIndexesDto
  ) {}
}
