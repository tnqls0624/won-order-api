import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

enum UserPushTokenPlatformType {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
  WEB = 'WEB',
  OTHER = 'OTHER'
}

export class RegistDeviceDto {
  @ApiProperty({ description: '시리얼', required: true })
  @IsString()
  serial: string;

  @ApiProperty({ description: '토큰', required: true })
  @IsString()
  token: string;

  @ApiProperty({ description: '기기 플랫폼', required: true })
  @IsEnum(UserPushTokenPlatformType)
  platform: UserPushTokenPlatformType;
}
