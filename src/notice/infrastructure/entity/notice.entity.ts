import { BaseEntity } from './base.entity';

export class NoticeEntity extends BaseEntity {
  writer: number;
  group_id: number;
  title: string;
  content: string;
  is_active: boolean;
  index: number;
}
