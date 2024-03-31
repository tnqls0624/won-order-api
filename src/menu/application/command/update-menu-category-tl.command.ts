import { ICommand } from '@nestjs/cqrs';
import { UpdateMenuCategoryTlsDto } from 'src/menu/interface/dto/update-menu-category-tl.dto';

export class UpdateMenuCategoryTlCommand implements ICommand {
  constructor(readonly body: UpdateMenuCategoryTlsDto) {}
}
