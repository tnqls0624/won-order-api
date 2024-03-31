import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMarketDto {
  @ApiProperty({ description: '통화 아이디', required: false })
  @IsOptional()
  @IsNumber()
  currency_id: number;

  @ApiProperty({ description: '언어 아이디', required: false })
  @IsOptional()
  @IsNumber()
  language_id: number;

  @ApiProperty({ description: '이름', required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: '액세스 아이디', required: false })
  @IsOptional()
  @IsString()
  access_id: string;

  @ApiProperty({ description: '액세스 아이디', required: false })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({ description: '연락처', required: false })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({ description: '이메일', required: false })
  @IsOptional()
  @IsString()
  email: string;
}
