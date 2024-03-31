import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { InjectionToken } from '../injection-token';
import { MainOrderRepository } from 'src/order/domain/main-order/main-order.repository';
import { DeleteReceiptPrintCommand } from './delete-receipt-print.command';

@CommandHandler(DeleteReceiptPrintCommand)
export class DeleteReceiptPrintCommandHandler
  implements ICommandHandler<DeleteReceiptPrintCommand>
{
  private readonly logger = new Logger(DeleteReceiptPrintCommand.name);

  constructor(
    @Inject(InjectionToken.MAIN_ORDER_REPOSITORY)
    private readonly mainOrderRepository: MainOrderRepository
  ) {}

  async execute(command: DeleteReceiptPrintCommand) {
    try {
      const { body } = command;
      const { ids } = body;
      await this.mainOrderRepository.deleteReceipt(ids);
      return true
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
}
