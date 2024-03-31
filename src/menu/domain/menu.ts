import { AggregateRoot } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { MenuState, MenuStatus } from '../infrastructure/entity/menu.entity';
import { CreateMenuOptionCategoryType } from '../interface/dto/create-menu.dto';
import { UpdateMenuDto } from '../interface/dto/update-menu.dto';
import { DeleteMenuEvent } from './event/delete-menu.event';
import { UpdateMenuIndexEvent } from './event/update-menu-index.event';
import { UpdateMenuEvent } from './event/update-menu.event';
import { UpdateMenuTlsDto } from '../interface/dto/update-menu-tl.dto';
import { UpdateMenuTlEvent } from './event/update-menu-tl.event';

export type MenuEssentialProperties = Readonly<
  Required<{
    menu_category_id: number;
    status: MenuStatus;
    state: MenuState;
    name: string;
    amount: number;
    is_active: boolean;
    menu_option_category: CreateMenuOptionCategoryType[];
  }>
>;

export type MenuOptionalProperties = Readonly<
  Partial<{
    index: number;
    content: string;
    image_ids: number[];
    remove_at: Date | null;
    create_at: Date;
    update_at: Date;
  }>
>;

export type MenuProperties = MenuEssentialProperties &
  Required<MenuOptionalProperties>;

export interface Menu {
  delete: () => void;
  update: (market_id: number, body: UpdateMenuDto) => void;
  updateIndex: (index: number) => void;
  updateMenuTl: (body: UpdateMenuTlsDto) => void;
}

export class MenuImplement extends AggregateRoot implements Menu {
  private readonly id: number;
  private readonly menu_category_id: number;
  private status: MenuStatus;
  private name: string;
  private content: string;
  private amount: number;
  private is_active: boolean;
  private index: number;
  private menu_option_category: CreateMenuOptionCategoryType[];
  private image_ids: number[];
  private create_at: Date;
  private update_at: Date;
  private remove_at: Date | null;

  constructor(properties: MenuProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }

  update(market_id: number, body: UpdateMenuDto) {
    if (!this.name) {
      throw new CustomError(RESULT_CODE.MENU_NAME_REQUEIRE);
    }

    if (this.amount <= 0) {
      throw new CustomError(RESULT_CODE.MENU_AMOUNT_IS_NOT_ZERO);
    }
    this.apply(new UpdateMenuEvent(market_id, this.id, body));
  }

  updateMenuTl(body: UpdateMenuTlsDto) {
    this.apply(new UpdateMenuTlEvent(body));
  }

  updateIndex(index: number) {
    this.apply(new UpdateMenuIndexEvent(this.id, index));
  }

  delete() {
    this.apply(new DeleteMenuEvent(this.id));
  }
}
