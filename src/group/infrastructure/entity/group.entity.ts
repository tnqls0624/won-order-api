import { BaseEntity } from '../../../auth/infrastructure/entity/base.entity';

export class GroupEntity extends BaseEntity {
  market_id: number;

  name: string;

  content: string;
}
