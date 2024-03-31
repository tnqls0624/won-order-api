import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

export enum OrderGroupPaymentStatus {
  NOT_PAID = 'NOT_PAID',
  PAID = 'PAID',
  REFUND = 'REFUND'
}

export enum OrderGroupPaymentType {
  ON_SITE_PAYMENT = 'ON_SITE_PAYMENT',
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  ABA_CREDIT_CARD = 'ABA_CREDIT_CARD',
  ABA_APP_PAYMENT = 'ABA_APP_PAYMENT'
}

export class OrderGroupPaymentEntity {
  id?: number;
  @ApiProperty({
    required: true,
    type: 'number',
    description: '그룹 아이디',
    example: 1
  })
  @IsNumber()
  group_id: number; // 가맹점 아이디

  @ApiProperty({
    required: true,
    type: 'number',
    description: '대주문 아이디',
    example: 1
  })
  @IsNumber()
  main_order_id: number; // 주문 번호

  @ApiProperty({
    required: false,
    type: 'enum',
    description: '주문 스테이터스',
    example: OrderGroupPaymentStatus.NOT_PAID,
    enum: OrderGroupPaymentStatus
  })
  @IsEnum(OrderGroupPaymentStatus)
  status: OrderGroupPaymentStatus; // 주문 상태

  @ApiProperty({
    required: true,
    type: 'number',
    description: '그룹 별 정산 합계',
    example: 1
  })
  @IsNumber()
  total: number; // 그룹 별 정산 합계

  create_at: Date;
  update_at: Date;
}
