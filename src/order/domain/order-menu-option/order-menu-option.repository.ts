import { OrderMenuOptionEntity } from 'src/order/infrastructure/entity/order-menu-option.entity';
import { OrderMenuOption } from './order-menu-option';

export interface OrderMenuOptionRepository {
  save: (order: OrderMenuOption) => Promise<OrderMenuOptionEntity | null>;
  update: (order: OrderMenuOption) => Promise<boolean>;
  delete: (order: OrderMenuOption) => Promise<boolean>;
  findById: (id: number) => Promise<OrderMenuOption | null>;
}
