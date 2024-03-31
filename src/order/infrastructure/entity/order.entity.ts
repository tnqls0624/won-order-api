import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../../../auth/infrastructure/entity/base.entity';

export class OrderEntity extends BaseEntity {
  @ApiProperty({
    required: false,
    type: 'string',
    description: '설명',
    example: '범진 많이 주세요'
  })
  @IsString()
  @IsOptional()
  main_order_id: number; // 대주문 번호

  @ApiProperty({
    required: false,
    type: 'string',
    description: '설명'
  })
  @IsString()
  order_num: string; // (소)주문 번호

  @ApiProperty({
    required: true,
    type: 'number',
    description: '총 가격',
    example: 10
  })
  @IsNumber()
  total: number; // 총 주문 가격

  @ApiPropertyOptional({
    required: false,
    type: 'string',
    description: '배송지주소'
  })
  @IsOptional()
  @IsString()
  delivery_addr?: string; // 배송지주소
}
