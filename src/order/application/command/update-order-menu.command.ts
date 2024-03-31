import { ICommand } from '@nestjs/cqrs';
import { OrderMenuStatus } from 'src/order/infrastructure/entity/order-menu.entity';

export class UpdateOrderMenuCommand implements ICommand {
  constructor(
    readonly ids: number[],
    readonly main_order_id: number,
    readonly status: OrderMenuStatus
  ) {}
}
