import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ description: '이름', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: '설명', required: false })
  @IsOptional()
  @IsString()
  content: string;
}
