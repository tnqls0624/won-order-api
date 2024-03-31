import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerificationDto {
  @ApiProperty({ example: 1, description: '인증 아이디' })
  @IsString()
  id: number;

  @ApiProperty({ example: '010112345678', description: '휴대폰 번호' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'dsagr432', description: '토큰 번호' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'dsa231321', description: '인증번호' })
  @IsString()
  code: string;
}
