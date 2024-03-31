import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OauthGoogleLoginDto {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  accessToken: string;
}
