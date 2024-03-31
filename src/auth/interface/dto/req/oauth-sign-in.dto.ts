import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OauthSignInDto {
  @ApiProperty({ description: '코드', required: true })
  @IsString()
  code: string;
  @ApiProperty({ description: '설정한 리다이렉트 URI', required: true })
  @IsString()
  redirect_uri: string;
  @ApiProperty({ description: '최초 유저 정보(애플만 해당)', required: false })
  @IsOptional()
  user: string;
}
