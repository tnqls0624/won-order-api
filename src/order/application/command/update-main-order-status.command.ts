import { ICommand } from '@nestjs/cqrs';
import { UpdateMainOrderStatusDto } from 'src/order/interface/dto/update-main-order-status.dto';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class UpdateMainOrderStatusCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly id: number,
    readonly body: UpdateMainOrderStatusDto
  ) {}
}
