import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReplyContactDto {
  @ApiProperty({ description: '답장 내용', required: true })
  @IsString()
  content: string;
  @ApiProperty({ description: '답장 제목', required: true })
  @IsString()
  title: string;
}
