import { AggregateRoot } from '@nestjs/cqrs';
import { MenuOptionEntity } from 'src/menu/infrastructure/entity/menu-option.entity';
import { MainOrderStatus } from 'src/order/infrastructure/entity/main-order.entity';
import { UpdateOrderDto } from 'src/order/interface/dto/update-order.dto';
import { MainOrderTypeEnum } from 'src/types';
import { UpdateMainOrderEvent } from '../event/update-main-order.event';
import { UpdateOrderEvent } from '../event/update-order.event';
import { Currency } from '@prisma/client';
import { CreateReceiptEvent } from '../event/create-receipt.event';
import { RefundOrderEvent } from '../event/refund-order.event';

type Order = {
  id: number;
  main_order_id: number;
  order_num: string;
  total: number;
  request: string;
  create_at: Date;
  update_at: Date;
  remove_at?: Date;
  order_menu: OrderMenu[];
};

export type OrderMenu = {
  id: number;
  order_id: number;
  menu_id: number;
  sum: number;
  create_at: Date;
  update_at: Date;
  remove_at: Date | null;
  order_menu_option: OrderMenuOption[];
};

export type OrderMenuOption = {
  id: number;
  order_menu_id: number;
  menu_option_id: number;
  menu_option?: MenuOptionEntity;
  create_at: Date;
  update_at: Date;
  remove_at: Date | null;
};

export type MainOrderEssentialProperties = Readonly<
  Required<{
    market_id: number;
    order_num: string;
    type: MainOrderTypeEnum;
    status: MainOrderStatus;
    total: number;
    create_at: Date;
    update_at: Date;
  }>
>;

export type MainOrderOptionalProperties = Readonly<
  Partial<{
    user_id?: number;
    guest_id?: string;
    currency_code: Currency;
    remove_at: Date | null;
  }>
>;

export type MainOrderProperties = Required<MainOrderEssentialProperties> &
  MainOrderOptionalProperties;

export interface MainOrder {
  update: (status: MainOrderStatus) => void;
  updateOrder: (body: UpdateOrderDto) => void;
  createReceipt: (group_id: number, language_code: string) => void;
  refund: (group_id: number) => void;
}

export class MainOrderImplement extends AggregateRoot implements MainOrder {
  private readonly id: number;
  private market_id: number;
  private user_id?: number;
  private guest_id?: string;
  private order_num: string;
  private type: MainOrderTypeEnum;
  private state: MainOrderStatus;
  private total: number;
  private currency_code: Currency;
  private remove_at?: Date;
  private create_at: Date;
  private update_at: Date;
  private order: Order[];

  constructor(properties: MainOrderProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }

  createReceipt(group_id: number, language_code: string) {
    this.apply(
      new CreateReceiptEvent(this.market_id, group_id, this.id, language_code)
    );
  }

  update(state: MainOrderStatus) {
    this.apply(new UpdateMainOrderEvent(this.id, state));
  }

  updateOrder(body: UpdateOrderDto) {
    this.apply(new UpdateOrderEvent(this.id, body));
  }

  refund(group_id: number) {
    this.apply(new RefundOrderEvent(this.id, group_id));
  }
}
