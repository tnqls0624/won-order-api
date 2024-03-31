import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { GroupTlEntity } from 'src/group/infrastructure/entity/group-tl.entity';

export class UpdateGroupTlDto extends PickType(GroupTlEntity, [
  'id',
  'name'
] as const) {}

export class UpdateGroupTlsDto {
  @ApiProperty({
    description: '메뉴 번역',
    type: UpdateGroupTlDto,
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
  group_tls: UpdateGroupTlDto[];
}
