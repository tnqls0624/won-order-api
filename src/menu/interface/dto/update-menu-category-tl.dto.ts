import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { MenuCategoryTlEntity } from 'src/menu/infrastructure/entity/menu-category-tl.entity';

export class UpdateMenuCategoryTlDto extends PickType(MenuCategoryTlEntity, [
  'id',
  'name'
] as const) {}

export class UpdateMenuCategoryTlsDto {
  @ApiProperty({
    description: '메뉴 번역',
    type: UpdateMenuCategoryTlDto,
    required: true,
    isArray: true,
    example: [
      {
        id: 1,
        name: '테스트'
      },
      {
        id: 2,
        name: '테스트2'
      }
    ]
  })
  @IsArray()
  menu_category_tls: UpdateMenuCategoryTlDto[];
}
