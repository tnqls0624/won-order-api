import { PickType } from '@nestjs/swagger';
import { MainOrderEntity } from 'src/order/infrastructure/entity/main-order.entity';

export class UpdateMainOrderStatusDto extends PickType(MainOrderEntity, [
  'status'
] as const) {}
