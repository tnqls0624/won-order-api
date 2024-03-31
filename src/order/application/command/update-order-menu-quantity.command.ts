import { ICommand } from '@nestjs/cqrs';

export class UpdateOrderMenuQuantityCommand implements ICommand {
  constructor(
    readonly main_order_id: number,
    readonly order_menu_id: number,
    readonly quantity: number
  ) {}
}
