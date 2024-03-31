import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ description: '내용', required: true })
  @IsString()
  content: string;

  @ApiProperty({ description: '비밀번호', required: false })
  @IsOptional()
  @IsString()
  password: string;
}
