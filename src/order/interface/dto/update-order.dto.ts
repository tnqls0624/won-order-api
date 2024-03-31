import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderEntity } from 'src/order/infrastructure/entity/order.entity';

// enum OrderGroupPaymentStatus {
//   NOT_PAID = 'NOT_PAID',
//   PAID = 'PAID'
// }

export class UpdateOrderMenuDto {
  @ApiProperty({ description: '주문 메뉴 ID', required: false })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '메뉴 ID', type: Number, required: false })
  menu_id: number;

  @ApiProperty({ description: '메뉴 수량', type: Number, required: false })
  quantity: number;

  // @ApiProperty({
  //   description: '메뉴 스테이터스',
  //   type: String,
  //   example: OrderMenuStatus.WAIT,
  //   required: false
  // })
  // status: OrderMenuStatus;

  @ApiProperty({
    description: '선택된 메뉴 옵션',
    type: Array,
    required: false,
    isArray: true,
    example: [1, 2]
  })
  @IsArray()
  menu_options: number[];
}

export class UpdateOrderGroupDto {
  @ApiProperty({ description: '주문 그룹 아이디', required: false })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '그룹 아이디', required: true })
  @IsNumber()
  group_id: number;

  @ApiProperty({ description: '요청 사항', required: false })
  @IsString()
  @IsOptional()
  request?: string;

  // @ApiProperty({
  //   description: '스테이터스',
  //   example: OrderGroupPaymentStatus.NOT_PAID,
  //   required: false
  // })
  // @IsEnum(OrderGroupPaymentStatus)
  // @IsOptional()
  // status?: OrderGroupPaymentStatus;

  @ApiProperty({
    description: '선택된 메뉴와 메뉴 옵션 정보',
    type: UpdateOrderMenuDto,
    required: true,
    isArray: true
  })
  @IsArray()
  order_menus: UpdateOrderMenuDto[];
}

export class UpdateOrderDto extends PickType(OrderEntity, [
  'delivery_addr'
] as const) {
  @ApiProperty({
    description: '그룹별 선택된 메뉴와 메뉴 옵션 정보',
    type: UpdateOrderGroupDto,
    required: true,
    isArray: true
  })
  @IsArray()
  order_groups: UpdateOrderGroupDto[];
}
