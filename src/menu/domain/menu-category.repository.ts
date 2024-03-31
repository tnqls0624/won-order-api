import { MenuCategoryEntity } from '../infrastructure/entity/menu-category.entity';
import { UpdateMenuCategoryDto } from '../interface/dto/update-menu-category.dto';
import { MenuCategory } from './menu-category';

export interface MenuCategoryRepository {
  save: (
    market_id: number,
    group_id: number,
    menu_category: MenuCategory
  ) => Promise<MenuCategoryEntity | null>;
  delete: (id: number) => Promise<boolean>;
  findById: (id: number) => Promise<MenuCategory | null>;
  findByCategoriesIdWithMarketId: (
    id: number
  ) => Promise<MenuCategoryEntity[] | null>;
  update: (
    id: number,
    market_id: number,
    body: UpdateMenuCategoryDto
  ) => Promise<boolean>;
  updateIndex: (id: number, index: number) => Promise<boolean>;
}
