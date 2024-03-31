import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '휴대폰 번호', required: true })
  @IsString()
  phone: string;

  @ApiProperty({ description: '패스워드', required: true })
  @IsString()
  password: string;

  @ApiProperty({ description: '닉네임', required: false })
  @IsOptional()
  @IsString()
  nickname: string;

  @ApiProperty({ description: '주소 ( 선택 )', required: false })
  @IsOptional()
  @IsString()
  address: string;
}
