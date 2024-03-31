import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import CustomError from '../../src/common/error/custom-error';
import { RESULT_CODE } from '../../src/constant';

@Injectable()
export class OauthGoogleService {
  private readonly oauth2Client: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.oauth2Client = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET')
    );
  }

  async generateAuthUrl(redirect_uri: string) {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile'],
      redirect_uri
    });
  }

  async getTokenByCode(code: string, redirect_uri: string): Promise<string> {
    const { tokens } = await this.oauth2Client.getToken({
      code,
      redirect_uri
    });
    return tokens.id_token!;
  }

  async getProfileByToken(accessToken: string): Promise<any> {
    const clientId: string = this.configService.get('GOOGLE_CLIENT_ID')!;
    const ticket = await this.oauth2Client.verifyIdToken({
      idToken: accessToken,
      audience: clientId
    });
    const data = ticket.getPayload();

    if (!data) throw new CustomError(RESULT_CODE.AUTH_GOOGLE_TOKEN_ERROR);

    return {
      provider_id: data.sub,
      name: data.name
    };
  }
}
