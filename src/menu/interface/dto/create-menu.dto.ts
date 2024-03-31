import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional } from 'class-validator';
import { MenuOptionCategoryEntity } from 'src/menu/infrastructure/entity/menu-option-category.entity';
import { MenuOptionEntity } from 'src/menu/infrastructure/entity/menu-option.entity';
import { MenuEntity } from 'src/menu/infrastructure/entity/menu.entity';

export class CreateMenuOptionType extends PickType(MenuOptionEntity, [
  'name',
  'amount'
] as const) {}
export class CreateMenuOptionCategoryType extends PickType(
  MenuOptionCategoryEntity,
  ['index', 'type', 'name', 'max_select_count'] as const
) {
  @ApiProperty({
    description: '메뉴 옵션',
    type: CreateMenuOptionType,
    required: true,
    isArray: true
  })
  @IsArray()
  menu_option: CreateMenuOptionType[];
}

export class CreateMenuType extends PickType(MenuEntity, [
  'menu_category_id',
  'status',
  'name',
  'content',
  'amount',
  'is_active'
] as const) {
  @ApiProperty({
    description: '메뉴 이미지 아이디 배열',
    required: false,
    type: 'number',
    isArray: true,
    example: [1, 2, 3]
  })
  @IsOptional()
  @IsArray()
  image_ids: number[];

  @ApiProperty({
    description: '메뉴 옵션 카테고리',
    type: CreateMenuOptionCategoryType,
    required: true,
    isArray: true
  })
  @IsArray()
  menu_option_category: CreateMenuOptionCategoryType[];
}

export class CreateMenuDto {
  @ApiProperty({ description: '메뉴', type: CreateMenuType, required: true })
  @IsObject()
  menu: CreateMenuType;

  static of(menu: CreateMenuType): CreateMenuDto {
    const dto = new CreateMenuDto();
    dto.menu = menu;
    return dto;
  }
}
