import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { InjectionToken } from '../injection-token';
import { CreateReceiptPrintCommand } from './create-receipt-print.command';
import { MainOrderRepository } from 'src/order/domain/main-order/main-order.repository';

@CommandHandler(CreateReceiptPrintCommand)
export class CreateReceiptPrintCommandHandler
  implements ICommandHandler<CreateReceiptPrintCommand>
{
  private readonly logger = new Logger(CreateReceiptPrintCommand.name);

  constructor(
    @Inject(InjectionToken.MAIN_ORDER_REPOSITORY)
    private readonly mainOrderRepository: MainOrderRepository
  ) {}

  async execute(command: CreateReceiptPrintCommand) {
    try {
      const { main_order_id, group_id, language_code } = command;
      const main_order = await this.mainOrderRepository.findById(main_order_id);
      if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);
      main_order.createReceipt(group_id, language_code);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
}
