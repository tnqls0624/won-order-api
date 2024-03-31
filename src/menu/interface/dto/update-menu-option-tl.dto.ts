import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { MenuOptionTlEntity } from 'src/menu/infrastructure/entity/menu-option-tl.entity';

export class UpdateMenuOptionTlDto extends PickType(MenuOptionTlEntity, [
  'id',
  'name'
] as const) {}

export class UpdateMenuOptionTlsDto {
  @ApiProperty({
    description: '메뉴 번역',
    type: UpdateMenuOptionTlDto,
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
  menu_option_tls: UpdateMenuOptionTlDto[];
}
