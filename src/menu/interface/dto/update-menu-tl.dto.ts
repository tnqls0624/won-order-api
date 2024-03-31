import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { MenuTlEntity } from 'src/menu/infrastructure/entity/menu-tl.entity';

export class UpdateMenuTlDto extends PickType(MenuTlEntity, [
  'id',
  'name',
  'content'
] as const) {}

export class UpdateMenuTlsDto {
  @ApiProperty({
    description: '메뉴 번역',
    type: UpdateMenuTlDto,
    required: true,
    isArray: true,
    example: [
      {
        id: 1,
        name: '테스트',
        content: '테스트 내용'
      },
      {
        id: 2,
        name: '테스트2',
        content: '테스트 내용2'
      }
    ]
  })
  @IsArray()
  menu_tls: UpdateMenuTlDto[];
}
