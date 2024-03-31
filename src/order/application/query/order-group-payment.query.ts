import { OrderGroupPaymentEntity } from 'src/order/infrastructure/entity/order-group-payment.entity';

export interface OrderGroupPaymentQuery {
  findByOrderIdWithGroupId: (
    main_order_id: number,
    group_id: number
  ) => Promise<OrderGroupPaymentEntity | null>;
}
