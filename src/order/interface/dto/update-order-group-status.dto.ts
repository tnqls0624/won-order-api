import { PickType } from '@nestjs/swagger';
import { OrderGroupPaymentEntity } from 'src/order/infrastructure/entity/order-group-payment.entity';

export class UpdateOrderGroupPaymentStatusDto extends PickType(
  OrderGroupPaymentEntity,
  ['status'] as const
) {}
