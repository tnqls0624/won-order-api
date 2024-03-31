import { CommentEntity } from '../infrastructure/entity/comment.entity';
import { Comment } from './comment';

export interface CommentRepository {
  save: (data: Comment) => Promise<CommentEntity | null>;
  findById: (id: number) => Promise<CommentEntity | null>;
  delete: (id: number) => Promise<boolean>;
  updateContent: (content: string, id: number) => Promise<boolean>;
}
