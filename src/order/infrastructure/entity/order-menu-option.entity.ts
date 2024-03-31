import { BaseEntity } from '../../../auth/infrastructure/entity/base.entity';

export class OrderMenuOptionEntity extends BaseEntity {
  order_menu_id: number; // 주문 메뉴 아이디

  order_option_id: string; // 메뉴 옵션 아이디
}
