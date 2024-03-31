import { ICommand } from '@nestjs/cqrs';
import { UpdateMenuOptionCategoryTlsDto } from 'src/menu/interface/dto/update-menu-option-category-tl.dto';

export class UpdateMenuOptionCategoryTlCommand implements ICommand {
  constructor(readonly body: UpdateMenuOptionCategoryTlsDto) {}
}
