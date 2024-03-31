import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { NoticeEntity } from '../../infrastructure/entity/notice.entity';

export class UpdateNoticeIndexDto extends PickType(NoticeEntity, [
  'id',
  'index'
] as const) {}

export class UpdateNoticeIndexesDto {
  @ApiProperty({
    description: '메뉴',
    type: UpdateNoticeIndexDto,
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
  notice: UpdateNoticeIndexDto[];
}
