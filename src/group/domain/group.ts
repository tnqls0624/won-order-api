import { AggregateRoot } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import { DeleteGroupEvent } from './event/delete-group.event';
import { SelectGroupEvent } from './event/select-group.event';
import { UpdateGroupEvent } from './event/update-group.event';

export type GroupEssentialProperties = Readonly<
  Required<{
    market_id: number;
    name: string;
    create_at: Date;
    update_at: Date;
    content: string;
  }>
>;

export type GroupOptionalProperties = Readonly<
  Partial<{
    remove_at: Date | null;
  }>
>;

export type GroupProperties = Required<GroupEssentialProperties> &
  GroupOptionalProperties;

export interface Group {
  delete: () => void;
  select: (admin_id: number, market_id: number, select_ids: number[]) => void;
  update: (market_id: number, name: string, content: string) => void;
}

export class GroupImplement extends AggregateRoot implements Group {
  private readonly id: number;
  private readonly market_id: number;
  private name: string;
  private content: string;
  private remove_at: Date | null;
  private create_at: Date;
  private update_at: Date;

  constructor(properties: GroupProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }

  select(admin_id: number, market_id: number, select_ids: number[]) {
    this.apply(new SelectGroupEvent(admin_id, market_id, select_ids));
  }

  update(market_id: number, name: string, content: string) {
    this.name = name;
    this.content = content;
    this.update_at = dayjs().toDate();
    this.apply(
      new UpdateGroupEvent(this.id, market_id, this.name, this.content)
    );
  }

  delete() {
    this.update_at = dayjs().toDate();
    this.remove_at = dayjs().toDate();
    this.apply(new DeleteGroupEvent(this.id));
  }
}
