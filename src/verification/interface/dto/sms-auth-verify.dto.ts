import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SmsAuthVerifyDto {
  @ApiProperty({ example: '82', description: '국가 코드' })
  @IsString()
  country_code: string;

  @ApiProperty({ example: '01011112222', description: '핸드폰 번호' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'asd324', description: '토큰' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'asd324', description: '인증번호' })
  @IsString()
  code: string;
}
