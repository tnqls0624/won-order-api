import { GroupEntity } from 'src/group/infrastructure/entity/group.entity';
import { MenuCategoryEntity } from 'src/menu/infrastructure/entity/menu-category.entity';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export interface MenuCategoryQuery {
  findById: (admin: AdminDto, id: number) => Promise<MenuCategoryEntity | null>;
  findAll: (
    market_id: number
  ) => Promise<MenuCategoryEntity[] | GroupEntity[] | null>;
}
