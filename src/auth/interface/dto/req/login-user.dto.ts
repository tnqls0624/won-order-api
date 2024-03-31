import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: '휴대폰 번호', required: true })
  @IsString()
  phone: string;

  @ApiProperty({ description: '패스워드', required: true })
  @IsString()
  password: string;
}
