import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseEntity } from './base.entity';

export class MenuOptionCategoryTlEntity extends BaseEntity {
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
    type: 'number',
    description: '언어 아이디',
    example: 1
  })
  @IsNumber()
  language_id: number;

  @ApiProperty({
    required: true,
    type: 'string',
    description: '번역 이름',
    example: 'name'
  })
  @IsString()
  name: string;
}
