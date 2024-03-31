import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateNoticeDto {
  @ApiProperty({ description: '제목', required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ description: '내용', required: false })
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({ description: '내용', required: false })
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
