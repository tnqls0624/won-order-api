import { BaseEntity } from './base.entity';

export class TableEntity extends BaseEntity {
  market_id: number;

  group_id: number;

  table_num: string;

  code: string;
}
