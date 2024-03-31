import { ICommand } from '@nestjs/cqrs';
import { UpdateMainOrderStatusDto } from 'src/order/interface/dto/update-main-order-status.dto';

export class UpdateMainOrderStatusForUserCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly body: UpdateMainOrderStatusDto
  ) {}
}
