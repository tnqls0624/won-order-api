import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventGateway } from 'src/event/gateway/event.gateway';
import { UpdateOrderGroupPaymentEvent } from 'src/order/domain/event/update-order-group-payments.event';
import { OrderGroupPaymentRepository } from 'src/order/domain/order-group-payment/order-group-payment.repository';
import { InjectionToken } from '../injection-token';

@EventsHandler(UpdateOrderGroupPaymentEvent)
export class UpdateOrderGroupPaymentEventHndler
  implements IEventHandler<UpdateOrderGroupPaymentEvent>
{
  constructor(
    private readonly eventGateway: EventGateway,
    @Inject(InjectionToken.ORDER_GROUP_PAYMENT_REPOSITORY)
    private readonly orderGroupPaymentRepository: OrderGroupPaymentRepository
  ) {}

  async handle(event: UpdateOrderGroupPaymentEvent) {
    const { id, main_order_id, status } = event;
    await this.orderGroupPaymentRepository.updates([id], main_order_id, status);
    const message = {
      main_order_id,
      order_group_payment_id: id,
      status
    };
    this.eventGateway.employeeOrderUpdateEvent(message);
    this.eventGateway.masterOrderUpdateEvent(message);
    this.eventGateway.customerOrderUpdateEvent(message);
  }
}
