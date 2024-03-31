import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMasterDto {
  @ApiProperty({ description: '통화 아이디', required: false })
  @IsOptional()
  @IsNumber()
  language_id: number;

  @ApiProperty({ description: '아이디', required: false })
  @IsOptional()
  @IsString()
  admin_id: string;

  @ApiProperty({ description: '패스워드', required: false })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({ description: '닉네임', required: false })
  @IsOptional()
  @IsString()
  nickname: string;
}
