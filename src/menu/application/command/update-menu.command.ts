import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { UpdateMenuDto } from '../../interface/dto/update-menu.dto';

export class UpdateMenuCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly id: number,
    readonly body: UpdateMenuDto
  ) {}
}
