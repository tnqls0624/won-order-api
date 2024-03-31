import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BaseEntity } from '../../../auth/infrastructure/entity/base.entity';

export enum OrderMenuStatus {
  WAIT = 'WAIT',
  PROGRESS = 'PROGRESS',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL'
}

export class OrderMenuEntity extends BaseEntity {
  order_id: number; // (소)주문 아이디

  order_group_id: number;

  menu_id: number; // 메뉴 아이디

  @ApiProperty({
    required: true,
    type: 'number',
    description: '그룹 아이디',
    enum: OrderMenuStatus,
    example: OrderMenuStatus.PROGRESS
  })
  @IsEnum(OrderMenuStatus)
  status: OrderMenuStatus; // 주문 메뉴 상태

  sum: number; // 가격 ( 메뉴 가격 + 옵션 가격)

  original_amount: number;
}
