import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { InjectionToken } from '../injection-token';
import { OrderRepository } from 'src/order/domain/order/order.repository';
import { RefundAbaOrderCommand } from './refund-aba-order.command';

@CommandHandler(RefundAbaOrderCommand)
export class RefundAbaOrderCommandHandler
  implements ICommandHandler<RefundAbaOrderCommand>
{
  private readonly logger = new Logger(RefundAbaOrderCommand.name);

  constructor(
    @Inject(InjectionToken.ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository
  ) {}

  async execute(command: RefundAbaOrderCommand) {
    try {
      const { id } = command;
      const order = await this.orderRepository.findById(id);
      if (!order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);
      order.abaRefund();
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
}
