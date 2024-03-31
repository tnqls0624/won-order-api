import { OrderEntity } from 'src/order/infrastructure/entity/order.entity';

export interface OrderQuery {
  findByOrderNum: (order_num: string) => Promise<OrderEntity | null>;
  findAll: (market_id: number) => Promise<OrderEntity[] | null>;
}
