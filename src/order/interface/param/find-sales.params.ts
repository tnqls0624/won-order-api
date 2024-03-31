import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindSalesParams {
  @ApiPropertyOptional({
    name: 'group_id',
    required: false,
    type: 'string',
    description: '그룹 아이디',
    example: '1'
  })
  @IsOptional()
  @IsString()
  group_id: string;

  @ApiPropertyOptional({
    name: 'from_date',
    required: false,
    type: 'string',
    description: '검색시작일'
  })
  @IsOptional()
  @IsString()
  from_date: string;

  @ApiPropertyOptional({
    name: 'to_date',
    required: false,
    type: 'string',
    description: '검색종료일'
  })
  @IsOptional()
  @IsString()
  to_date: string;
}
