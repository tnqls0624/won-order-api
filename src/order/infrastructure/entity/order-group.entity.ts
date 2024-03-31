import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export enum OrderGroupPaymentStatus {
  NOT_PAID = 'NOT_PAID',
  PAID = 'PAID'
}

export class OrderGroupEntity {
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
    description: '오더 아이디',
    example: 1
  })
  @IsNumber()
  order_id: number; // 주문 번호

  // @ApiProperty({
  //   required: false,
  //   type: 'enum',
  //   description: '주문 스테이터스',
  //   example: OrderGroupStatus.NOT_PAID,
  //   enum: OrderGroupStatus
  // })
  // @IsEnum(OrderGroupStatus)
  // status: OrderGroupStatus; // 주문 상태

  // @ApiProperty({
  //   required: true,
  //   type: 'number',
  //   description: '그룹 별 정산 합계',
  //   example: 1
  // })
  // @IsNumber()
  // total: number; // 그룹 별 정산 합계

  @ApiProperty({
    required: false,
    type: 'string',
    description: '요청사항',
    example: '범진이 많이주세요'
  })
  @IsString()
  request?: string; // 총 가격

  create_at: Date;
  update_at: Date;
}
