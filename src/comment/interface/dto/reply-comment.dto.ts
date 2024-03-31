import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ReplyCommentDto {
  @ApiProperty({ description: '문의글 ID', required: true })
  @IsNumber()
  parent_id: number;

  @ApiProperty({ description: '내용', required: true })
  @IsString()
  content: string;
}
