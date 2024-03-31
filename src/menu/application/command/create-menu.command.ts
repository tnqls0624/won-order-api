import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { CreateMenuDto } from '../../interface/dto/create-menu.dto';

export class CreateMenuCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly body: CreateMenuDto
  ) {}
}
