import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderMenuEntity } from 'src/order/infrastructure/entity/order-menu.entity';

export class UpdateOrderMenuStatusDto extends PickType(OrderMenuEntity, [
  'status'
] as const) {
  @ApiProperty({
    description: '오더 메뉴 아이디',
    required: true,
    isArray: true,
    example: [1, 2, 3]
  })
  order_menu_ids: number[];
}
