import { Injectable } from '@nestjs/common';
import appleSigninAuth from 'apple-signin-auth';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OauthAppleService {
  constructor(private readonly configService: ConfigService) {}

  async generateAuthUrl(redirect_url: string): Promise<string> {
    const options = {
      clientID: this.configService.get('APPLE_CLIENT_ID'),
      redirectUri: this.configService.get('APPLE_REDIRECT_URI'),
      state: redirect_url,
      scope: 'email name'
    };
    return appleSigninAuth.getAuthorizationUrl(options);
  }

  async getTokenByCode(code: string): Promise<any> {
    const clientSecret = appleSigninAuth.getClientSecret({
      clientID: this.configService.get('APPLE_CLIENT_ID')!,
      teamID: this.configService.get('APPLE_TEAM_ID')!,
      privateKey: this.configService.get('APPLE_PRIVATE_KEY')!,
      keyIdentifier: this.configService.get('APPLE_KEY_ID')!,
      expAfter: 15777000
    });
    const options = {
      clientID: this.configService.get('APPLE_CLIENT_ID'),
      redirectUri: this.configService.get('APPLE_REDIRECT_URI'),
      clientSecret: clientSecret
    };
    const response = await appleSigninAuth.getAuthorizationToken(code, options);
    return response.id_token;
  }

  async getProfileByToken(id_token: string): Promise<any> {
    const { sub: provider_id, email } =
      await appleSigninAuth.verifyIdToken(id_token);
    return {
      provider_id,
      email
    };
  }
}
