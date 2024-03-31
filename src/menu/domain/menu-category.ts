import { AggregateRoot } from '@nestjs/cqrs';
import { MenuStatus } from '@prisma/client';
import dayjs from 'dayjs';
import { UpdateMenuCategoryDto } from '../interface/dto/update-menu-category.dto';
import { DeleteMenuCategoryEvent } from './event/delete-menu-category.event';
import { UpdateMenuCategoryIndexEvent } from './event/update-menu-category-index.event';
import { UpdateMenuCategoryEvent } from './event/update-menu-category.event';

export type MenuCategoryEssentialProperties = Readonly<
  Required<{
    market_id: number;
    group_id: number;
    name: string;
  }>
>;

export type MenuCategoryOptionalProperties = Readonly<
  Partial<{
    index: number;
    content: string;
    create_at: Date;
    update_at: Date;
    remove_at: Date | null;
  }>
>;

export type MenuCategoryProperties = MenuCategoryEssentialProperties &
  Required<MenuCategoryOptionalProperties>;

export interface MenuCategory {
  delete: () => void;
  update: (market_id: number, body: UpdateMenuCategoryDto) => void;
  updateIndex: (index: number) => void;
}

export class MenuCategoryImplement
  extends AggregateRoot
  implements MenuCategory
{
  private readonly id: number;
  private market_id: number;
  private group_id: number;
  private status: MenuStatus;
  private index: number;
  private name: string;
  private content: string;
  private create_at: Date;
  private update_at: Date;
  private remove_at: Date | null;

  constructor(properties: MenuCategoryProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }
  updateIndex(index: number): void {
    this.index = index;
    this.update_at = dayjs().toDate();
    this.apply(new UpdateMenuCategoryIndexEvent(this.id, index));
  }

  update(market_id: number, body: UpdateMenuCategoryDto) {
    this.name = body.name;
    this.content = body.content;
    this.index = body.index;
    this.status = body.status;
    this.update_at = dayjs().toDate();
    this.apply(new UpdateMenuCategoryEvent(this.id, market_id, body));
  }

  delete() {
    this.update_at = dayjs().toDate();
    this.remove_at = dayjs().toDate();
    this.apply(new DeleteMenuCategoryEvent(this.id));
  }
}
