import { PageOptionsDto } from '../../../utils/paginate/dto';

export interface NoticeQuery {
  findAll: (
    group_id: number,
    market_id: number,
    page_options: PageOptionsDto
  ) => Promise<any | null>;
  findById: (id: number) => Promise<any | null>;
  findByByIsActiveTrue: (group_id: number) => Promise<any[] | null>;
}
