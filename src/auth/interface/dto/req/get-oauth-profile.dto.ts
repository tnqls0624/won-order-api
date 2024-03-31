import { Provider } from '../../../../types/login.type';

export class GetOauthProfileDto {
  accessToken: string;
  userInfo: string | null | undefined;
  provider: Provider;
}
