import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { MenuEntity } from 'src/menu/infrastructure/entity/menu.entity';

export class UpdateMenuIndexDto extends PickType(MenuEntity, [
  'id',
  'index'
] as const) {}
export class UpdateMenuIndexesDto {
  @ApiProperty({
    description: '메뉴',
    type: UpdateMenuIndexDto,
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
  menu: UpdateMenuIndexDto[];
}
