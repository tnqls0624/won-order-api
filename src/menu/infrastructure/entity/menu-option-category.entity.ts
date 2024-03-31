import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { BaseEntity } from './base.entity';
import { MenuOptionEntity } from './menu-option.entity';

export enum MenuOptionCategoryType {
  REQUIRE = 'REQUIRE',
  OPTION = 'OPTION'
}

export class MenuOptionCategoryEntity extends BaseEntity {
  @ApiProperty({
    required: true,
    type: 'number',
    description: '메뉴 아이디',
    example: 1
  })
  @IsNumber()
  menu_id: number;

  @ApiProperty({
    required: true,
    type: 'number',
    description: '순서',
    example: 1
  })
  @IsNumber()
  index: number;

  @ApiProperty({
    required: true,
    type: 'enum',
    description: '메뉴 옵션 카테고리 타입 (REQUIRE, OPTION)',
    example: MenuOptionCategoryType.REQUIRE
  })
  @IsEnum(MenuOptionCategoryType)
  type: MenuOptionCategoryType;

  @ApiPropertyOptional({
    required: true,
    type: 'string',
    description: '메뉴 이름',
    example: '범진이 상체'
  })
  @IsString()
  name: string;

  max_select_count: number;

  menu_option: MenuOptionEntity[];
}
