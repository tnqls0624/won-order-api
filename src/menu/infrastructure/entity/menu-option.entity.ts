import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseEntity } from './base.entity';

export class MenuOptionEntity extends BaseEntity {
  @ApiProperty({
    required: true,
    type: 'number',
    description: '메뉴 옵션 카테고리 아이디',
    example: 1
  })
  @IsNumber()
  menu_option_category_id: number;

  @ApiPropertyOptional({
    required: true,
    type: 'string',
    description: '메뉴 이름',
    example: '범진이 목'
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    type: 'number',
    description: '가격',
    example: 1000
  })
  @IsNumber()
  amount: number;
}
