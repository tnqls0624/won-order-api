import { IQuery } from '@nestjs/cqrs';
import { Provider } from '../../../types/login.type';

export class SignInOauthQuery implements IQuery {
  constructor(
    readonly accessToken: string,
    readonly userInfo: string | null | undefined,
    readonly provider: Provider
  ) {}
}
