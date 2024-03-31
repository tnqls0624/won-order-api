import { ICommand } from '@nestjs/cqrs';
import { UpdateMenuCategoryIndexesDto } from 'src/menu/interface/dto/update-menu-category-index.dto';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class UpdateMenuCategoryIndexCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly body: UpdateMenuCategoryIndexesDto
  ) {}
}
