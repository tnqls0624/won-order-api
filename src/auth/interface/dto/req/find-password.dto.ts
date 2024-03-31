import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindPasswordDto {
  @ApiProperty({ description: '국가 코드', required: true })
  @IsString()
  country_code: string;

  @ApiProperty({ description: '핸드폰 번호', required: true })
  @IsString()
  phone: string;

  @ApiProperty({ description: '인증코드', required: true })
  @IsString()
  code: string;

  @ApiProperty({ description: '토큰', required: true })
  @IsString()
  token: string;

  @ApiProperty({ description: '변경할 비밀번호', required: true })
  @IsString()
  password: string;
}
