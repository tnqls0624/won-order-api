import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { CreateMenuCategoryDto } from '../../interface/dto/create-menu-category.dto';

export class CreateMenuCategoryCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly body: CreateMenuCategoryDto
  ) {}
}
