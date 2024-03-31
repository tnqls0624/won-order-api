import { AggregateRoot } from '@nestjs/cqrs';
import {
  MenuEntity,
  MenuStatus
} from 'src/menu/infrastructure/entity/menu.entity';
import { OrderMenuStatus } from 'src/order/infrastructure/entity/order-menu.entity';
import { UpdateQuantityEvent } from '../event/update-quantity.event';

export type OrderMenuOption = {
  id: number;
  order_menu_id: number;
  menu_option_id: number;
  create_at: Date;
  update_at: Date;
  remove_at: Date;
  menu_option: MenuOption[];
};

export type MenuOption = {
  id: number;
  menu_option_category_id: number;
  index: number;
  name: string;
  amount: number;
  create_at: Date;
  update_at: Date;
  remove_at: Date;
};

export type Menu = {
  id: number;
  menu_category_id: number;
  index: number;
  status: MenuStatus;
  name: string;
  content: string;
  amount: number;
  is_active: boolean;
  create_at: Date;
  update_at: Date;
  remove_at: Date;
};

export type OrderMenuEssentialProperties = Readonly<
  Required<{
    order_id: number;
    order_group_id: number;
    menu_id: number;
    status: OrderMenuStatus;
    sum: number;
    original_amount: number;
  }>
>;

export type OrderMenuOptionalProperties = Readonly<
  Partial<{
    remove_at: Date | null;
    create_at: Date;
    update_at: Date;
  }>
>;

export type OrderMenuProperties = OrderMenuEssentialProperties &
  Required<OrderMenuOptionalProperties>;

export interface OrderMenu {
  updateQuantity: (main_order_id: number, quantity: number) => void;
}

export class OrderMenuImplement extends AggregateRoot implements OrderMenu {
  private readonly id: number;
  private order_id: number;
  private order_group_id: number;
  private menu_id: number;
  private status: OrderMenuStatus;
  private sum: number;
  private original_amount: number;
  private remove_at: Date | null;
  private create_at: Date;
  private update_at: Date;
  private menu: MenuEntity;
  private order_menu_option: OrderMenuOption[];
  constructor(properties: OrderMenuProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }
  updateQuantity(main_order_id: number, quantity: number) {
    this.apply(new UpdateQuantityEvent(this.id, main_order_id, quantity));
  }
}
