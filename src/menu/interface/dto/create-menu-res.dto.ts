import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject } from 'class-validator';
import { MenuOptionCategoryEntity } from 'src/menu/infrastructure/entity/menu-option-category.entity';
import { MenuOptionEntity } from 'src/menu/infrastructure/entity/menu-option.entity';
import { Menu } from 'src/order/infrastructure/entities';

export class CreateMenuResDto {
  constructor(
    menu: Menu,
    menu_option_category: MenuOptionCategoryEntity[],
    menu_option: MenuOptionEntity[]
  ) {
    this.menu = menu;
    this.menu_option_category = menu_option_category;
    this.menu_option = menu_option;
  }

  @ApiProperty({ description: '메뉴', type: Menu, required: true })
  @IsObject()
  menu: Menu;

  @ApiProperty({
    description: '메뉴 옵션 카테고리',
    type: MenuOptionCategoryEntity,
    required: true,
    isArray: true
  })
  @IsArray()
  menu_option_category: MenuOptionCategoryEntity[];

  @ApiProperty({
    description: '메뉴 옵션',
    type: MenuOptionEntity,
    required: true,
    isArray: true
  })
  @IsArray()
  menu_option: MenuOptionEntity[];
}
