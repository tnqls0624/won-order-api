import { OrderEntity } from 'src/order/infrastructure/entity/order.entity';
import { Order } from './order';

export interface OrderRepository {
  save: (order: Order) => Promise<OrderEntity | null>;
  update: (order: Order) => Promise<boolean>;
  delete: (order: Order) => Promise<boolean>;
  findById: (id: number) => Promise<Order | null>;
}
