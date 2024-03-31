import { TableEntity } from 'src/table/infrastructure/entity/table.entity';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { PageOptionsDto } from 'src/utils/paginate/dto';

export interface TableQuery {
  findAll: (
    market_id: number,
    group_id: number,
    language_id: number,
    page_options: PageOptionsDto
  ) => Promise<any>;
  findAllForEmployee: (admin: AdminDto) => Promise<TableEntity[] | null>;
  findById: (id: number) => Promise<any | null>;
  findByIdWithLanguageId: (
    id: number,
    language_id: number
  ) => Promise<any | null>;
  findByNumWithLanguageGroupId: (
    table_num: string,
    group_id: number,
    language_id: number
  ) => Promise<any | null>;
  findAllCustomQR: (
    market_id: number,
    page_options: PageOptionsDto
  ) => Promise<any | null>;
  findCustomQR: (id: number) => Promise<any | null>;
}
