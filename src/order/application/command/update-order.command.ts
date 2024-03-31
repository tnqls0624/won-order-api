import { ICommand } from '@nestjs/cqrs';
import { UpdateOrderDto } from 'src/order/interface/dto/update-order.dto';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class UpdateOrderCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly id: number,
    readonly body: UpdateOrderDto
  ) {}
}
