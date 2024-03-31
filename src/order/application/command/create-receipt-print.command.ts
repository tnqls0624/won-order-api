import { ICommand } from '@nestjs/cqrs';

export class CreateReceiptPrintCommand implements ICommand {
  constructor(
    readonly main_order_id: number,
    readonly group_id: number,
    readonly language_code: string
  ) {}
}
