import { OrderGroupPaymentStatus } from 'src/order/infrastructure/entity/order-group-payment.entity';
import { OrderGroupPayment } from './order-group-payment';

export interface OrderGroupPaymentRepository {
  updates: (
    ids: number[],
    main_order_id: number,
    status: OrderGroupPaymentStatus
  ) => Promise<boolean>;
  findById: (id: number) => Promise<OrderGroupPayment | null>;
  findAllByIds: (ids: number[]) => Promise<OrderGroupPayment[] | null>;
}
