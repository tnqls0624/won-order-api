import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UpdateSelectGroupDto {
  constructor(select_ids: number[]) {
    this.select_ids = select_ids;
  }
  @ApiProperty({ description: '선택 번호 배열', required: false })
  @IsArray()
  select_ids: number[];
}
