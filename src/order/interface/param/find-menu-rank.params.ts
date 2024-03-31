import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindMenuRankParams {
  @ApiPropertyOptional({
    name: 'group_id',
    required: false,
    type: 'string',
    description: '그룹 아이디',
    example: 1
  })
  @IsOptional()
  @IsString()
  group_id: string;

  @ApiPropertyOptional({
    name: 'date',
    required: false,
    type: 'string',
    description: '검색월'
  })
  @IsOptional()
  @IsString()
  date: string;
}
