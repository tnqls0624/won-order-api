import { Module } from '@nestjs/common';
import { OauthGoogleService } from './oauth-google.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [OauthGoogleService],
  exports: [OauthGoogleService]
})
export class OauthGoogleModule {}
