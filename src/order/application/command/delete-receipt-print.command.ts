import { ICommand } from '@nestjs/cqrs';
import { DeleteReceiptDto } from 'src/order/interface/dto/delete-receipt.dto';

export class DeleteReceiptPrintCommand implements ICommand {
  constructor(
    readonly body: DeleteReceiptDto
  ) {}
}
