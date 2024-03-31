import { UpdateMenuCategoryTlsDto } from '../interface/dto/update-menu-category-tl.dto';
import { UpdateMenuOptionCategoryTlsDto } from '../interface/dto/update-menu-option-category-tl.dto';
import { UpdateMenuOptionTlsDto } from '../interface/dto/update-menu-option-tl.dto';
import { UpdateMenuTlsDto } from '../interface/dto/update-menu-tl.dto';
import { UpdateMenuDto } from '../interface/dto/update-menu.dto';
import { Menu } from './menu';

export interface MenuRepository {
  save: (market_id: number, menu: Menu) => Promise<boolean>;
  delete: (id: number) => Promise<boolean>;
  findById: (id: number) => Promise<Menu | null>;
  update: (
    market_id: number,
    id: number,
    body: UpdateMenuDto
  ) => Promise<boolean>;
  updateIndex: (id: number, index: number) => Promise<boolean>;
  updateMenuTl: (body: UpdateMenuTlsDto) => Promise<boolean>;
  updateMenuOptionTl: (body: UpdateMenuOptionTlsDto) => Promise<boolean>;
  updateMenuCategoryTl: (body: UpdateMenuCategoryTlsDto) => Promise<boolean>;
  updateMenuOptionCategoryTl: (
    body: UpdateMenuOptionCategoryTlsDto
  ) => Promise<boolean>;
}
