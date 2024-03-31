import { ICommand } from '@nestjs/cqrs';
import { UpdateOrderTransactionDto } from 'src/order/interface/dto/update-order-transaction.dto';

export class UpdateOrderTransactionCommand implements ICommand {
  constructor(
    readonly body: UpdateOrderTransactionDto
  ) {}
}
