import { OrderTransactionEntity } from 'src/order/infrastructure/entity/order-transaction.entity';
import { OrderTransaction } from './order-transaction';

export interface OrderTransactionRepository {
  save: (order: OrderTransaction) => Promise<OrderTransactionEntity | null>;
  update: (id: number, status: number) => Promise<boolean>;
  findByTranId: (order_num: string) => Promise<OrderTransaction | null>;
}
