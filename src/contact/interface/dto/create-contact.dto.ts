import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ description: '내용', required: true })
  @IsString()
  content: string;
  @ApiProperty({ description: '이름', required: true })
  @IsString()
  name: string;
  @ApiProperty({ description: '상호명', required: true })
  @IsString()
  company: string;
  @ApiProperty({ description: '이메일', required: true })
  @IsString()
  email: string;
  @ApiProperty({ description: '연락처', required: true })
  @IsString()
  phone: string;
}
