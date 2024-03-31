import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseEntity } from '../../../menu/infrastructure/entity/base.entity';

export class GroupTlEntity extends BaseEntity {
  @ApiProperty({
    required: true,
    type: 'number',
    description: '그룹 아이디',
    example: 1
  })
  @IsNumber()
  menu_id: number;

  @ApiPropertyOptional({
    required: true,
    type: 'number',
    description: '언어 아이디',
    example: 1
  })
  @IsNumber()
  language_id: number;

  @ApiProperty({
    required: true,
    type: 'string',
    description: '번역 이름',
    example: 'name'
  })
  @IsString()
  name: string;
}
