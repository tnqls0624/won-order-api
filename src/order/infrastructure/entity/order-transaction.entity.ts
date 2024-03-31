import { OrderGroupPaymentType } from './order-group-payment.entity';

export class OrderTransactionEntity {
  main_order_num: string; // 주문 번호

  order_num: string; // 소주문 번호

  data: object; // json 데이터

  pay_type: OrderGroupPaymentType;

  status: number;

  create_at: Date;

  update_at: Date;
}
