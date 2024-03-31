import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { EventGateway } from 'src/event/gateway/event.gateway';
import { OrderGroupPaymentRepository } from 'src/order/domain/order-group-payment/order-group-payment.repository';
import { InjectionToken } from '../injection-token';
import { MainOrderQuery } from '../query/main-order.query';
import { UpdateOrderGroupPaymentsStatusCommand } from './update-order-group-payments-status.command';

@CommandHandler(UpdateOrderGroupPaymentsStatusCommand)
export class UpdateOrderGroupPaymentsStatusCommandHandler
  implements ICommandHandler<UpdateOrderGroupPaymentsStatusCommand>
{
  constructor(
    private readonly eventGateway: EventGateway,
    @Inject(InjectionToken.ORDER_GROUP_PAYMENT_REPOSITORY)
    private readonly orderGroupPaymentRepository: OrderGroupPaymentRepository,
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    private readonly mainOrderQuery: MainOrderQuery
  ) {}

  async execute(command: UpdateOrderGroupPaymentsStatusCommand) {
    const { ids, main_order_id, status, admin } = command;
    await this.orderGroupPaymentRepository.updates(ids, main_order_id, status);
    const main_order =
      await this.mainOrderQuery.findFirstMainOrderById(main_order_id);
    if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);

    setTimeout(() => {
      const message: any = {
        type: 'PAYMENT',
        main_order_id,
        market_id: admin.market_id,
        order_group_payment_ids: ids,
        status
      };
      this.eventGateway.employeeOrderUpdateEvent(message);
      this.eventGateway.masterOrderUpdateEvent(message);
      if (main_order.guest_id) message.guest_id = main_order.guest_id;
      if (main_order.user_id) message.user_id = main_order.user_id;
      this.eventGateway.customerOrderUpdateEvent(message);
    }, 500);

    return true;
  }
}
