import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { EventGateway } from 'src/event/gateway/event.gateway';
import { OrderMenuRepository } from 'src/order/domain/order-menu/order-menu.repository';
import { InjectionToken } from '../injection-token';
import { MainOrderQuery } from '../query/main-order.query';
import { UpdateOrderMenuCommand } from './update-order-menu.command';

@CommandHandler(UpdateOrderMenuCommand)
export class UpdateOrderMenuCommandHandler
  implements ICommandHandler<UpdateOrderMenuCommand>
{
  constructor(
    private readonly eventGateway: EventGateway,
    @Inject(InjectionToken.ORDER_MENU_REPOSITORY)
    private readonly orderMenuRepository: OrderMenuRepository,
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    private readonly mainOrderQuery: MainOrderQuery
  ) {}

  async execute(command: UpdateOrderMenuCommand) {
    const { ids, main_order_id, status } = command;
    await this.orderMenuRepository.updates(ids, main_order_id, status);
    const main_order =
      await this.mainOrderQuery.findFirstMainOrderById(main_order_id);
    if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);

    setTimeout(() => {
      const message: any = {
        type: 'ORDER_MENU',
        main_order_id: main_order.id,
        market_id: main_order.market_id,
        order_menu_ids: ids,
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
