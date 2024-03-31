import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInOauthDto {
  @IsNotEmpty()
  @ApiProperty({ description: '토큰' })
  accessToken: string;
}
