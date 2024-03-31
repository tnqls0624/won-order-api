import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { MenuCategoryEntity } from 'src/menu/infrastructure/entity/menu-category.entity';

export class UpdateMenuCategoryIndexDto extends PickType(MenuCategoryEntity, [
  'id',
  'index'
] as const) {}
export class UpdateMenuCategoryIndexesDto {
  @ApiProperty({
    description: '메뉴 카테고리',
    type: UpdateMenuCategoryIndexDto,
    required: true,
    isArray: true,
    example: [
      {
        id: 1,
        index: 1
      },
      {
        id: 2,
        index: 2
      }
    ]
  })
  @IsArray()
  menu_category: UpdateMenuCategoryIndexDto[];
}
