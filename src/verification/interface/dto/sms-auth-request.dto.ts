import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SmsAuthRequestDto {
  @ApiProperty({ example: '82', description: '국가 코드' })
  @IsString()
  country_code: string;

  @ApiProperty({ example: '010112345678', description: '휴대폰 번호' })
  @IsString()
  phone: string;
}
