import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MainOrderTypeEnum } from 'src/types';
import { BaseEntity } from '../../../auth/infrastructure/entity/base.entity';

export enum MainOrderStatus {
  WAIT = 'WAIT',
  PROGRESS = 'PROGRESS',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL'
}

export class MainOrderEntity extends BaseEntity {
  @ApiProperty({
    required: true,
    type: 'number',
    description: '가맹점 아이디',
    example: 1
  })
  @IsNumber()
  market_id: number; // 가맹점 아이디

  @ApiProperty({
    required: false,
    type: 'number',
    description: '유저 아이디',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  user_id?: number; // 유저 아이디

  @ApiProperty({
    required: false,
    type: 'string',
    description: '게스트 아이디',
    example: 'asdiujriwe'
  })
  @IsNumber()
  @IsOptional()
  guest_id?: string; // 게스트 아이디

  @ApiProperty({
    required: false,
    type: 'number',
    description: '테이블 아이디',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  table_id?: number; // 테이블 아이디

  @ApiProperty({
    required: true,
    type: 'enum',
    description: '주문 타입',
    example: MainOrderTypeEnum.HALL
  })
  @IsEnum(MainOrderTypeEnum)
  type: MainOrderTypeEnum; // 게스트 아이디

  @ApiProperty({
    required: true,
    type: 'string',
    description: '주문 번호',
    example: 'fdnsofneqofq'
  })
  @IsString()
  order_num: string; // 주문 번호

  @ApiProperty({
    required: true,
    type: 'enum',
    description: '주문 상태',
    example: MainOrderStatus.WAIT
  })
  @IsEnum(MainOrderStatus)
  status: MainOrderStatus; // 주문 상태

  @ApiProperty({
    required: false,
    type: 'number',
    description: '총 가격',
    example: 20
  })
  @IsNumber()
  total: number; // 총 가격
}
