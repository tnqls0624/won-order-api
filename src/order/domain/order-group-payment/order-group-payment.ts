import { AggregateRoot } from '@nestjs/cqrs';
import { OrderGroupPaymentStatus } from 'src/order/infrastructure/entity/order-group-payment.entity';
import { UpdateOrderGroupPaymentEvent } from '../event/update-order-group-payments.event';

export type OrderGroupPaymentEssentialProperties = Readonly<
  Required<{
    main_order_id: number;
    group_id: number;
    total: number;
    status: OrderGroupPaymentStatus;
    create_at: Date;
    update_at: Date;
  }>
>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type OrderGroupPaymentOptionalProperties = Readonly<Partial<{}>>;

export type OrderGroupPaymentProperties = OrderGroupPaymentEssentialProperties &
  Partial<OrderGroupPaymentOptionalProperties>;

export interface OrderGroupPayment {
  update: (main_order_id: number, status: OrderGroupPaymentStatus) => void;
}

export class OrderGroupPaymentImplement
  extends AggregateRoot
  implements OrderGroupPayment
{
  private readonly id: number;
  private main_order_id: number;
  private group_id: number;
  private total: number;
  private status: OrderGroupPaymentStatus;
  private create_at: Date;
  private update_at: Date;

  constructor(properties: OrderGroupPaymentProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }

  update(main_order_id: number, status: OrderGroupPaymentStatus) {
    this.apply(
      new UpdateOrderGroupPaymentEvent(this.id, main_order_id, status)
    );
  }
}
