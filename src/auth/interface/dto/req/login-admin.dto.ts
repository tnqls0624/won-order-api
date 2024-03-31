import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    description: '액세스 아이디(마켓 액세스 아이디)',
    required: true
  })
  @IsOptional()
  @IsString()
  access_id: string;

  @ApiProperty({ description: '어드민 아이디', required: true })
  @IsString()
  admin_id: string;

  @ApiProperty({ description: '패스워드', required: true })
  @IsString()
  password: string;
}
