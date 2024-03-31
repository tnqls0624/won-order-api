import { AggregateRoot } from '@nestjs/cqrs';
import { OrderGroupPaymentType } from 'src/order/infrastructure/entity/order-group-payment.entity';
import { UpdateOrderTransactionEvent } from '../event/update-order-transaction.event';

export type OrderTransactionEssentialProperties = Readonly<
  Required<{
    main_order_num: string;
    order_num: string;
    data: object;
    pay_type: OrderGroupPaymentType;
    status: number;
  }>
>;

export type OrderTransactionOptionalProperties = Readonly<
  Partial<{
    create_at: Date;
    update_at: Date;
  }>
>;

export type OrderTransactionProperties = OrderTransactionEssentialProperties &
  Required<OrderTransactionOptionalProperties>;

export interface OrderTransaction {
  updateOrder: (status: number) => void;
  get: () => any;
}

export class OrderTransactionImplement
  extends AggregateRoot
  implements OrderTransaction
{
  private readonly id: number;
  private main_order_num: string;
  private order_num: string;
  private data: object;
  private status: number;
  constructor(properties: OrderTransactionProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }
  updateOrder(status: number) {
    this.apply(new UpdateOrderTransactionEvent(this.id, status));
  }
  get() {
    return {
      id: this.id,
      main_order_num: this.main_order_num,
      order_num: this.order_num,
      status: this.status,
      data: this.data
    };
  }
}
