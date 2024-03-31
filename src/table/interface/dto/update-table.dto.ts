import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateTableDto {
  @ApiProperty({ description: '테이블 식별 번호', required: true })
  @IsString()
  table_num: string;

  @ApiProperty({ description: '그룹 아이디', required: true })
  @IsNumber()
  group_id: number;
}
