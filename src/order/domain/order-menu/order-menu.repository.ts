import {
  OrderMenuEntity,
  OrderMenuStatus
} from 'src/order/infrastructure/entity/order-menu.entity';
import { OrderMenu } from './order-menu';
import { OrderTransaction } from '../order-transaction/order-transaction';

export interface OrderMenuRepository {
  save: (order: OrderMenu) => Promise<OrderMenuEntity | null>;
  updates: (
    ids: number[],
    main_order: number,
    status: OrderMenuStatus
  ) => Promise<boolean>;
  updateQuantity: (
    id: number,
    main_order_id: number,
    quantity: number
  ) => Promise<boolean>;
  delete: (order: OrderMenu) => Promise<boolean>;
  findById: (id: number) => Promise<OrderMenu | null>;
  findByTranId: (order_num: string) => Promise<OrderTransaction | null>;
  findAllByIds: (ids: number[]) => Promise<OrderMenu[] | null>;
}
