import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { MenuOptionCategoryTlEntity } from 'src/menu/infrastructure/entity/menu-option-category-tl.entity';

export class UpdateMenuOptionCategoryTlDto extends PickType(
  MenuOptionCategoryTlEntity,
  ['id', 'name'] as const
) {}

export class UpdateMenuOptionCategoryTlsDto {
  @ApiProperty({
    description: '메뉴 번역',
    type: UpdateMenuOptionCategoryTlDto,
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
  menu_option_category_tls: UpdateMenuOptionCategoryTlDto[];
}
