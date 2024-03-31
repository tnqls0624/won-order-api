import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { InjectionToken } from '../injection-token';
import { RefundOrderCommand } from './refund-order.command';
import { MainOrderRepository } from 'src/order/domain/main-order/main-order.repository';

@CommandHandler(RefundOrderCommand)
export class RefundOrderCommandHandler
  implements ICommandHandler<RefundOrderCommand>
{
  private readonly logger = new Logger(RefundOrderCommand.name);

  constructor(
    @Inject(InjectionToken.MAIN_ORDER_REPOSITORY)
    private readonly mainOrderRepository: MainOrderRepository
  ) {}

  async execute(command: RefundOrderCommand) {
    try {
      const { id, group_id } = command;
      const main_order = await this.mainOrderRepository.findById(id);
      if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);
      main_order.refund(group_id);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
}
