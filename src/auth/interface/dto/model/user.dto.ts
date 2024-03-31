import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: '아이디' })
  id: number;

  @ApiProperty({ description: '휴대폰 번호' })
  @IsString()
  phone: string;

  @ApiProperty({ description: '닉네임' })
  @IsString()
  nickname: string;

  @ApiProperty({ description: '주소' })
  @IsString()
  address: string;

  @ApiProperty({ description: '삭제날짜' })
  @IsDate()
  remove_at: Date;
}
