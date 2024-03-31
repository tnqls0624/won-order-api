import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePasswordDto {
  constructor(password: string) {
    this.password = password;
  }
  @ApiProperty({ description: '패스워드' })
  @IsString()
  password: string;
}
