import { ICommand } from '@nestjs/cqrs';
import { OrderGroupPaymentStatus } from 'src/order/infrastructure/entity/order-group-payment.entity';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class UpdateOrderGroupPaymentsStatusCommand implements ICommand {
  constructor(
    readonly ids: number[],
    readonly admin: AdminDto,
    readonly main_order_id: number,
    readonly status: OrderGroupPaymentStatus
  ) {}
}
