import { BaseEntity } from './base.entity';

enum MenuStatus {
  BLIND = 'BLIND',
  FOR_SALE = 'FOR_SALE',
  SOLD_OUT = 'SOLD_OUT'
}

export class MenuCategoryEntity extends BaseEntity {
  market_id: number;

  group_id: number;

  index: number;

  status?: MenuStatus;

  name: string;

  content: string;
}
