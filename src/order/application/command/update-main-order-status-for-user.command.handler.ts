import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { EventGateway } from 'src/event/gateway/event.gateway';
import { MainOrderRepository } from 'src/order/domain/main-order/main-order.repository';
import { InjectionToken } from '../injection-token';
import { MainOrderQuery } from '../query/main-order.query';
import { UpdateMainOrderStatusForUserCommand } from './update-main-order-status-for-user.command';

@CommandHandler(UpdateMainOrderStatusForUserCommand)
export class UpdateMainOrderStatusForUserCommandHandler
  implements ICommandHandler<UpdateMainOrderStatusForUserCommand>
{
  constructor(
    private readonly eventGateway: EventGateway,
    @Inject(InjectionToken.MAIN_ORDER_REPOSITORY)
    private readonly mainOrderRepository: MainOrderRepository,
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    private readonly mainOrderQuery: MainOrderQuery
  ) {}

  async execute(command: UpdateMainOrderStatusForUserCommand) {
    const { id, body } = command;
    const main_order = await this.mainOrderRepository.findById(id);
    if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);
    main_order.update(body.status);
    const main_order_entity =
      await this.mainOrderQuery.findFirstMainOrderById(id);

    setTimeout(async () => {
      const message: any = {
        type: 'MAIN_ORDER',
        market_id: main_order_entity.market_id,
        main_order_id: id,
        status: body.status
      };
      this.eventGateway.employeeOrderUpdateEvent(message);
      this.eventGateway.masterOrderUpdateEvent(message);
      if (main_order_entity.guest_id)
        message.guest_id = main_order_entity.guest_id;
      if (main_order_entity.user_id)
        message.user_id = main_order_entity.user_id;
      this.eventGateway.customerOrderUpdateEvent(message);
    }, 500);

    return true;
  }
}
