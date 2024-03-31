import { BaseEntity } from './base.entity';

export class CommentEntity extends BaseEntity {
  writer_id: number | null;
  writer_name: string;
  group_id: number;
  content: string;
  is_secret: boolean;
  parent_id: number | null;
  password: string | null;
}
