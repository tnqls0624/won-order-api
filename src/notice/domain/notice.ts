import { AggregateRoot } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import { DeleteNoticeEvent } from './event/delete-notice.event';
import { UpdateNoticeDto } from '../interface/dto/update-notice.dto';
import { UpdateNoticeEvent } from './event/update-notice.event';
import { UpdateNoticeIndexEvent } from './event/update-notice-index.event';

export type NoticeEssentialProperties = Readonly<
  Required<{
    writer: number;
    group_id: number;
    title: string;
    content: string;
    is_active: boolean;
    index: number;
  }>
>;

export type NoticeOptionalProperties = Readonly<
  Partial<{
    create_at: Date;
    update_at: Date;
    remove_at: Date | null;
  }>
>;

export type NoticeProperties = NoticeEssentialProperties &
  Required<NoticeOptionalProperties>;

export interface Notice {
  delete: () => void;
  update: (body: UpdateNoticeDto) => void;
  updateIndex: (index: number) => void;
}

export class NoticeImplement extends AggregateRoot implements Notice {
  private readonly id: number;
  private readonly writer: number;
  private readonly group_id: number;
  private index: number;
  private title: string;
  private content: string;
  private is_active: boolean;
  private create_at: Date;
  private update_at: Date;
  private remove_at: Date | null;

  constructor(properties: NoticeProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }

  delete(): void {
    this.update_at = dayjs().toDate();
    this.remove_at = dayjs().toDate();
    this.apply(new DeleteNoticeEvent(this.id));
  }

  update(body: UpdateNoticeDto) {
    this.apply(new UpdateNoticeEvent(this.id, body));
  }

  updateIndex(index: number): void {
    this.index = index;
    this.update_at = dayjs().toDate();
    this.apply(new UpdateNoticeIndexEvent(this.id, index));
  }
}
