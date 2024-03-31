import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import CustomError from '../../src/common/error/custom-error';
import { RESULT_CODE } from '../../src/constant';

@Injectable()
export class OauthFacebookService {
  static readonly BASE_AUTH_URL: string =
    'https://www.facebook.com/v19.0/dialog/oauth';
  static readonly TOKEN_URL: string =
    'https://graph.facebook.com/v19.0/oauth/access_token';
  static readonly PROFILE_URL: string = 'https://graph.facebook.com/me';

  constructor(private readonly configService: ConfigService) {}

  async generateAuthUrl(redirect_uri: string) {
    const params = {
      client_id: this.configService.get<string>('FB_CLIENT_ID'),
      redirect_uri,
      state: 'test'
    };
    const url = new URL(OauthFacebookService.BASE_AUTH_URL);
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    return url.toString();
  }

  async getTokenByCode(code: string, redirect_uri: string): Promise<string> {
    const params = {
      client_id: this.configService.get<string>('FB_CLIENT_ID'),
      redirect_uri,
      client_secret: this.configService.get<string>('FB_CLEINT_SECRET'),
      code: code
    };
    const response = await axios.get(OauthFacebookService.TOKEN_URL, {
      params
    });
    if (!response.data.access_token)
      throw new CustomError(RESULT_CODE.FB_TOKEN_EXCHANGE_ERROR);
    console.log(response.data.access_token);
    return response.data.access_token;
  }

  async getProfileByToken(accessToken: string): Promise<any> {
    const params = {
      access_token: accessToken,
      fields: 'id,name'
    };
    const response = await axios.get(OauthFacebookService.PROFILE_URL, {
      params
    });
    return {
      provider_id: response.data.id,
      name: response.data.name
    };
  }
}