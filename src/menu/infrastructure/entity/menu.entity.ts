import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { CreateMenuOptionCategoryType } from 'src/menu/interface/dto/create-menu.dto';
import { BaseEntity } from './base.entity';

export enum MenuStatus {
  BLIND = 'BLIND',
  FOR_SALE = 'FOR_SALE',
  SOLD_OUT = 'SOLD_OUT'
}

export enum MenuState {
  NORMAL = 'NORMAL',
  NEW = 'NEW',
  BEST = 'BEST',
  NEW_BEST = 'NEW_BEST'
}

// export enum Currency {
//   KHR = 'KHR',
//   KRW = 'KRW',
//   USD = 'USD',
//   CNY = 'CNY'
// }

export class MenuEntity extends BaseEntity {
  @ApiProperty({
    required: true,
    type: 'number',
    description: '메뉴 카테고리 아이디',
    example: 1
  })
  @IsNumber()
  menu_category_id: number;

  @ApiProperty({
    required: true,
    type: 'enum',
    description: '메뉴 스테이터스(BLIND, FOR_SALE, SOLD_OUT)',
    example: MenuStatus.BLIND
  })
  @IsEnum(MenuStatus)
  status: MenuStatus;

  @ApiProperty({
    required: true,
    type: 'enum',
    description: '메뉴 스테이트(NORMAL, NEW, BEST, NEW_BEST)',
    example: MenuState.NORMAL
  })
  @IsEnum(MenuState)
  state: MenuState;

  @ApiPropertyOptional({
    required: true,
    type: 'string',
    description: '메뉴 이름',
    example: '범진이'
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    type: 'string',
    description: '설명',
    example: '범진이입니다'
  })
  @IsString()
  content: string;

  @ApiProperty({
    required: true,
    type: 'number',
    description: '가격',
    example: 1000
  })
  @IsNumber()
  amount: number;

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
    type: 'boolean',
    description: '대표 메뉴 설정',
    example: false
  })
  @IsBoolean()
  is_active: boolean;

  menu_option_category: CreateMenuOptionCategoryType[];

  image_ids: number[];
}
