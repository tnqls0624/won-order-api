import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OauthAppleService } from './oauth-apple.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [OauthAppleService],
  exports: [OauthAppleService]
})
export class OauthAppleModule {}
