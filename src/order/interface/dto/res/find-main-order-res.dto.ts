import { Expose, Type } from 'class-transformer';
import { MenuOptionCategoryType } from 'src/menu/infrastructure/entity/menu-option-category.entity';
import {
  MenuState,
  MenuStatus
} from 'src/menu/infrastructure/entity/menu.entity';
import { MainOrderStatus } from 'src/order/infrastructure/entity/main-order.entity';
import { OrderGroupPaymentStatus } from 'src/order/infrastructure/entity/order-group-payment.entity';
import { OrderMenuStatus } from 'src/order/infrastructure/entity/order-menu.entity';
import { MainOrderTypeEnum } from 'src/types';

class MenuTl {
  @Expose()
  id: number;
  @Expose()
  name: string;
}

class MenuOption {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  amount: number;
  @Expose()
  index: number;

  @Type(() => MenuOptionTl)
  @Expose()
  menu_option_tl: MenuOptionTl[];

  @Type(() => MenuOptionCategory)
  @Expose()
  menu_option_category: MenuOptionCategory;
}

class MenuOptionTl {
  @Expose()
  id: number;
  @Expose()
  name: string;
}

class MenuOptionCategoryTl {
  @Expose()
  id: number;
  @Expose()
  name: string;
}
class Menu {
  @Expose()
  id: number;
  @Expose()
  status: MenuStatus;
  @Expose()
  state: MenuState;
  @Expose()
  name: string;
  @Expose()
  amount: number;
  @Expose()
  index: number;
  @Expose()
  is_active: boolean;

  @Type(() => MenuTl)
  @Expose()
  menu_tl: MenuTl;
}

class OrderMenuOption {
  @Expose()
  id: number;
  @Expose()
  original_amount: number;

  @Type(() => Menu)
  @Expose()
  menu: Menu;

  @Type(() => MenuOption)
  @Expose()
  menu_option: MenuOption;
}
class OrderGroupPayment {
  @Expose()
  id: number;
  @Expose()
  group_id: number;
  @Expose()
  total: number;
  @Expose()
  status: OrderGroupPaymentStatus;
}
class GroupTL {
  @Expose()
  id: number;
  @Expose()
  name: string;
}
class Setting {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  address: string;
  @Expose()
  tel: string;
}
class Groups {
  @Expose()
  id: number;
  @Expose()
  name: string;

  @Type(() => Setting)
  setting: Setting;

  @Type(() => OrderGroupPayment)
  @Expose()
  order_group_payment: OrderGroupPayment[];

  @Type(() => GroupTL)
  @Expose()
  group_tl: GroupTL[];

  @Type(() => OrderGroup)
  @Expose()
  order_group: OrderGroup[];
}
class Market {
  @Expose()
  id: number;
  @Expose()
  name: string;

  @Type(() => Groups)
  @Expose()
  group: Groups[];
}

class User {
  @Expose()
  phone: string;
  @Expose()
  nickname: string;
}

class Group {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Type(() => GroupTL)
  @Expose()
  group_tl: GroupTL;
}

class OrderMenu {
  @Expose()
  id: number;
  @Expose()
  status: OrderMenuStatus;
  @Expose()
  sum: number;
  @Expose()
  original_amount: number;
  @Expose()
  quantity: number;

  @Type(() => Menu)
  @Expose()
  menu: Menu;

  @Type(() => OrderMenuOption)
  @Expose()
  order_menu_option: OrderMenuOption[];
}

class MenuOptionCategory {
  @Expose()
  id: number;
  @Expose()
  index: number;
  @Expose()
  type: MenuOptionCategoryType;
  @Expose()
  name: string;
  @Expose()
  max_select_count: number;

  @Type(() => MenuOptionCategoryTl)
  @Expose()
  menu_option_category_tl: MenuOptionCategoryTl[];
}

class OrderGroup {
  @Expose()
  id: number;
  @Expose()
  request: string;

  @Type(() => OrderMenu)
  @Expose()
  order_menu: OrderMenu[];
}

class Table {
  @Expose()
  id: number;
  @Expose()
  group_id: number;
  @Expose()
  table_num: string;

  @Type(() => Group)
  @Expose()
  group: Group;
}

export class FindMainOrderResDTO {
  @Expose()
  id: number;

  @Expose()
  market_id: number;

  @Type(() => Market)
  @Expose()
  market: Market;

  @Expose()
  user_id: string;

  @Expose()
  guest_id: string;

  @Expose()
  table: Table;

  @Expose()
  delivery_addr: string;

  @Expose()
  type: MainOrderTypeEnum;

  @Expose()
  order_num: string;

  @Expose()
  status: MainOrderStatus;

  @Expose()
  total: number;

  @Type(() => User)
  @Expose()
  user: User;

  @Expose()
  create_at: Date;
}
