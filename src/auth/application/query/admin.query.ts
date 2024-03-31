import { AdminEntity } from 'src/auth/infrastructure/entity/admin.entity';
import { MarketEntity } from 'src/auth/infrastructure/entity/market.entity';
import { AdminType } from 'src/types/login.type';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { PageOptionsDto } from 'src/utils/paginate/dto';

export interface AdminQuery {
  findById: (id: number) => Promise<AdminEntity | null>;
  findAllAdmin: () => Promise<AdminEntity[]>;
  findMarketById: (id: number) => Promise<MarketEntity | null>;
  checkDuplicateById: (market_id: number, admin_id: string) => Promise<boolean>;
  login: (type: AdminType, access_id: string, admin_id: string) => Promise<any>;
  findAll: (
    admin: AdminDto,
    group_id: number,
    admin_id: string,
    nickname: string,
    page_query: PageOptionsDto
  ) => Promise<any | null>;
  findAllByType: (
    market_id: number,
    group_id: number,
    type: AdminType
  ) => Promise<{ id: number; language_id: number }[]>;
  findAlreadyOrder: (market_id: number) => Promise<any | null>;
  duplicatedIdCheck: (type: AdminType, admin_id: string) => Promise<any>;
  duplicatedAdminCheck: (type: AdminType, market_id: number) => Promise<any>;
}
