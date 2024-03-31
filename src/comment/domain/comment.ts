import { AggregateRoot } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import { UpdateCommentContentEvent } from './event/update-comment-content.event';
import { DeleteCommentEvent } from './event/delete-comment.event';

export type CommentEssentialProperties = Readonly<
  Required<{
    group_id: number;
    content: string;
    is_secret: boolean;
    writer_name: string;
  }>
>;

export type CommentOptionalProperties = Readonly<
  Partial<{
    password: string | null;
    writer_id: number | null;
    parent_id: number | null;
    create_at: Date;
    update_at: Date;
    remove_at: Date | null;
  }>
>;

export type CommentProperties = CommentEssentialProperties &
  Required<CommentOptionalProperties>;

export interface Comment {
  updateContent: (content: string) => void;
  delete: () => void;
  isMine: (userId: number | null, password: string) => boolean;
}

export class CommentImplement extends AggregateRoot implements Comment {
  private readonly id: number;
  private readonly parent_id: number | null;
  private readonly group_id: number;
  private readonly writer_id: number | null;
  private readonly writer: string;
  private content: string;
  private is_secret: boolean;
  private password: string | null;
  private create_at: Date;
  private update_at: Date;
  private remove_at: Date | null;

  constructor(properties: CommentProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }

  updateContent(content: string): void {
    this.content = content;
    this.update_at = dayjs().toDate();
    this.apply(new UpdateCommentContentEvent(this.id, content));
  }

  delete() {
    this.update_at = dayjs().toDate();
    this.remove_at = dayjs().toDate();
    this.apply(new DeleteCommentEvent(this.id));
  }

  isMine(userId: number | null, password: string | null) {
    return this.writer_id === userId || this.password === password;
  }
}
