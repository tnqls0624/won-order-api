import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({ description: '제목', required: true })
  @IsString()
  title: string;

  @ApiProperty({ description: '내용', required: true })
  @IsString()
  content: string;

  @ApiProperty({ description: '그룹 아이디', required: true })
  @IsNumber()
  group_id: number;
}
