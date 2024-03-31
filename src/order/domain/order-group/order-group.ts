import { AggregateRoot } from '@nestjs/cqrs';
import { OrderGroupPaymentStatus } from 'src/order/infrastructure/entity/order-group-payment.entity';
import { UpdateOrderGroupPaymentEvent } from '../event/update-order-group-payments.event';

export type OrderGroupEssentialProperties = Readonly<
  Required<{
    group_id: number;
    order_id: number;
    create_at: Date;
    update_at: Date;
  }>
>;

export type OrderGroupOptionalProperties = Readonly<
  Partial<{
    request: string;
  }>
>;

export type OrderGroupProperties = OrderGroupEssentialProperties &
  Partial<OrderGroupOptionalProperties>;

export interface OrderGroup {
  update: (main_order_id: number, status: OrderGroupPaymentStatus) => void;
}

export class OrderGroupImplement extends AggregateRoot implements OrderGroup {
  private readonly id: number;
  private order_id: number;
  private group_id: number;
  private request: string;
  private create_at: Date;
  private update_at: Date;
  constructor(properties: OrderGroupProperties) {
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
