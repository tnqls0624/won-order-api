import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { UpdateMenuCategoryDto } from '../../interface/dto/update-menu-category.dto';

export class UpdateMenuCategoryCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly id: number,
    readonly body: UpdateMenuCategoryDto
  ) {}
}
