import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindAllNoticeForUserParams {
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
}
