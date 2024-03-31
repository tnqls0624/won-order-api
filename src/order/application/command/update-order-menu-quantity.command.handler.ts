import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import {
  INTEGRATION_EVENT_PUBLISHER,
  IntegrationEventPublisher
} from 'libs/message.module';

import { RESULT_CODE } from 'src/constant';
import { InjectionToken } from '../injection-token';
import { UpdateOrderMenuQuantityCommand } from './update-order-menu-quantity.command';
import { OrderMenuRepository } from 'src/order/domain/order-menu/order-menu.repository';

@CommandHandler(UpdateOrderMenuQuantityCommand)
export class UpdateOrderMenuQuantityCommandHandler
  implements ICommandHandler<UpdateOrderMenuQuantityCommand>
{
  private readonly logger = new Logger(UpdateOrderMenuQuantityCommand.name);

  constructor(
    @Inject(InjectionToken.ORDER_MENU_REPOSITORY)
    private readonly orderMenuRepository: OrderMenuRepository,
    @Inject(INTEGRATION_EVENT_PUBLISHER)
    private readonly integrationEventPublisher: IntegrationEventPublisher
  ) {}

  async execute(command: UpdateOrderMenuQuantityCommand) {
    try {
      const { main_order_id, order_menu_id, quantity } = command;
      const order_menu = await this.orderMenuRepository.findById(order_menu_id);
      if (!order_menu) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);
      order_menu.updateQuantity(main_order_id, quantity);
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
}
