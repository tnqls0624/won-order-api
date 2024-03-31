import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';
import { OrderGroupPaymentType } from 'src/order/infrastructure/entity/order-group-payment.entity';
import { OrderEntity } from 'src/order/infrastructure/entity/order.entity';
import { MainOrderTypeEnum } from 'src/types';

export class CreateOrderMenuDto {
  @ApiProperty({ description: '메뉴 ID', type: Number, required: true })
  @IsNumber()
  menu_id: number;

  @ApiProperty({ description: '수량', type: Number, required: true })
  @IsNumber()
  quantity: number;

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

export class CreateOrderGroupDto {
  @ApiProperty({
    description: '그룹 ID',
    type: Number,
    required: true
  })
  group_id: number;

  @ApiProperty({ description: '요청 사항', required: false })
  @IsString()
  @IsOptional()
  request?: string;

  @ApiProperty({
    description: '선택된 메뉴와 메뉴 옵션 정보',
    type: CreateOrderMenuDto,
    required: true,
    isArray: true
  })
  @IsArray()
  menus: CreateOrderMenuDto[];
}

export class CreateOrderDto extends PickType(OrderEntity, [
  'delivery_addr'
] as const) {
  @ApiProperty({ description: '가맹점 ID', required: true })
  @IsInt()
  market_id: number;

  @ApiProperty({
    description: '핸드폰 번호',
    type: 'string',
    required: false
  })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    description: '메모',
    type: 'string',
    required: false
  })
  @IsOptional()
  @IsString()
  memo: string;

  @ApiProperty({
    description: '그룹별 선택된 메뉴와 메뉴 옵션 정보',
    type: CreateOrderGroupDto,
    required: true,
    isArray: true
  })
  @IsArray()
  order_groups: CreateOrderGroupDto[];

  user_id?: number;

  @ApiProperty({ description: '비회원 ID', required: false })
  @IsString()
  @IsOptional()
  guest_id?: string;

  @ApiProperty({
    required: false,
    type: 'string',
    description: '테이블 (검증)코드',
    example: '25800783-312d-4e61-a416-ee427d6b494c'
  })
  @IsOptional()
  @IsUUID()
  table_code?: string;

  @ApiProperty({
    required: true,
    type: 'number',
    description: '테이블아이디',
    example: 13
  })
  @IsOptional()
  @IsNumber()
  table_id?: number; // 테이블아이디

  @ApiProperty({
    required: true,
    enum: MainOrderTypeEnum,
    description: '주문방식',
    example: MainOrderTypeEnum.HALL
  })
  @IsEnum(MainOrderTypeEnum)
  type: MainOrderTypeEnum; // 주문방식

  @ApiProperty({
    required: true,
    enum: OrderGroupPaymentType,
    description: '결제방식',
    example: OrderGroupPaymentType.ON_SITE_PAYMENT
  })
  @IsEnum(OrderGroupPaymentType)
  pay_type: OrderGroupPaymentType; // 결제방식

  @ApiProperty({
    required: false,
    type: 'string',
    description: '구글 맵 url 주소',
    example: '구글.맵.com'
  })
  @IsOptional()
  @IsString()
  map_url: string; // google map
}
