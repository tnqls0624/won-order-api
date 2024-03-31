import { MenuEntity } from 'src/menu/infrastructure/entity/menu.entity';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export interface MenuQuery {
  findById: (admin: AdminDto, id: number) => Promise<MenuEntity | null>;
  findAllAdminMenu: (
    id: number,
    market_id: number,
    status: string
  ) => Promise<MenuEntity[] | null>;
  findAllUserMenu: (
    market_id: number,
    language_code: string
  ) => Promise<any[] | null>;
  findMenuTl: (id: number) => Promise<any | null>;
  findMenuOptionTl: (id: number) => Promise<any | null>;
  findMenuCategoryTl: (id: number) => Promise<any | null>;
  findMenuOptionCategoryTl: (id: number) => Promise<any | null>;
}
