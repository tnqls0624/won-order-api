import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OauthFacebookService } from './oauth-facebook.service';

@Module({
  imports: [ConfigModule],
  providers: [OauthFacebookService],
  exports: [OauthFacebookService]
})
export class OauthFacebookModule {}
