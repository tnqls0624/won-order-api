import { AggregateRoot } from '@nestjs/cqrs';

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

export type OrderMenuEssentialProperties = Readonly<
  Required<{
    order_menu_id: number;
    menu_option_id: number;
  }>
>;

export type OrderMenuOptionalProperties = Readonly<
  Partial<{
    remove_at: Date | null;
    create_at: Date;
    update_at: Date;
  }>
>;

export type OrderMenuOptionProperties = OrderMenuEssentialProperties &
  Required<OrderMenuOptionalProperties>;

export interface OrderMenuOption {}

export class OrderMenuOptionImplement
  extends AggregateRoot
  implements OrderMenuOption
{
  private readonly id: number;
  private order_menu_id: number;
  private menu_option_id: number;
  private create_at: Date;
  private update_at: Date;
  private remove_at: Date | null;
  private menu_option: MenuOption[];
  constructor(properties: OrderMenuOptionProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }
}
