import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderGroupPaymentStatus } from 'src/order/infrastructure/entity/order-group-payment.entity';
import { OrderMenuStatus } from 'src/order/infrastructure/entity/order-menu.entity';

export enum UserTypeEnum {
  USER = 'USER',
  GUEST = 'GUEST'
}
export class FindOrdersAdminParams {
  @ApiPropertyOptional({
    name: 'table_id',
    required: false,
    type: 'string',
    description: '테이블 아이디'
  })
  @IsOptional()
  @IsString()
  table_id: string;

  @ApiPropertyOptional({
    name: 'group_ids',
    required: false,
    type: 'string',
    description: '그룹아이디'
  })
  @IsOptional()
  @IsString()
  group_ids: string | string[];

  @ApiPropertyOptional({
    name: 'order_num',
    required: false,
    type: 'string',
    description: '주문번호'
  })
  @IsOptional()
  @IsString()
  order_num: string;

  @ApiPropertyOptional({
    name: 'menu_name',
    required: false,
    type: 'string',
    description: '메뉴이름'
  })
  @IsOptional()
  @IsString()
  menu_name: string;

  @ApiPropertyOptional({
    name: 'menu',
    required: false,
    type: 'string',
    description: '메뉴이름'
  })
  @IsOptional()
  @IsEnum(UserTypeEnum)
  user_type: UserTypeEnum;

  @ApiPropertyOptional({
    name: 'types',
    type: 'string',
    required: false,
    description: '주문 타입'
  })
  @IsOptional()
  @IsString()
  types: string | string[];

  @ApiPropertyOptional({
    name: 'status',
    required: false,
    type: 'string',
    description: '주문 상태'
  })
  @IsOptional()
  @IsString()
  status: string | string[];

  @ApiPropertyOptional({
    name: 'order_menu_status',
    required: false,
    enum: OrderMenuStatus,
    description: '제외 메뉴 상태'
  })
  @IsOptional()
  @IsEnum(OrderMenuStatus)
  order_menu_status: OrderMenuStatus;

  @ApiPropertyOptional({
    name: 'order_group_payment_status',
    required: false,
    enum: OrderGroupPaymentStatus,
    description: '그룹별 정산 상태'
  })
  @IsOptional()
  @IsEnum(OrderGroupPaymentStatus)
  order_group_payment_status: OrderGroupPaymentStatus;

  @ApiPropertyOptional({
    name: 'from_date',
    required: false,
    type: 'string',
    description: '검색시작일'
  })
  @IsOptional()
  @IsString()
  from_date: string;

  @ApiPropertyOptional({
    name: 'to_date',
    required: false,
    type: 'string',
    description: '검색종료일'
  })
  @IsOptional()
  @IsString()
  to_date: string;
}
