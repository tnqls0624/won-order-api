import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserQuery } from 'src/auth/application/query/user.query';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { CacheService } from 'src/cache/service/cache.service';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { SignInOauthQuery } from './sign-in-oauth.query';
import { LoginType, Provider } from '../../../types/login.type';
import { UserRepository } from '../../domain/user.repository';
import { UserFactory } from '../../domain/user.factory';
import { OauthGoogleService } from 'libs/oauth-google/oauth-google.service';
import { OauthFacebookService } from '../../../../libs/oauth-facebook/oauth-facebook.service';
import { OauthAppleService } from '../../../../libs/oauth-apple/oauth-apple.service';

@QueryHandler(SignInOauthQuery)
export class SignInOauthQueryHandler
  implements IQueryHandler<SignInOauthQuery>
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.USER_QUERY)
    private readonly userQuery: UserQuery,
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly googleService: OauthGoogleService,
    private readonly facebookService: OauthFacebookService,
    private readonly appleService: OauthAppleService,
    @Inject(InjectionToken.USER_FACTORY)
    private readonly userFactory: UserFactory
  ) {}

  private getFullName(userString) {
    let user;

    if (!userString) {
      return null;
    }

    try {
      user = JSON.parse(userString);
    } catch (e) {
      console.error('Failed to parse user string', e);
      return null;
    }

    if (user && user.name) {
      return `${user.name.lastName}${user.name.firstName}`;
    }

    return null;
  }

  async execute(query: SignInOauthQuery) {
    const { accessToken, userInfo, provider } = query;
    if (!accessToken) throw new CustomError(RESULT_CODE.AUTH_NEED_ACCESS_ID);
    let provider_id;
    let name;
    let user;

    switch (provider) {
      case Provider.google:
        ({ provider_id, name } =
          await this.googleService.getProfileByToken(accessToken));
        break;
      case Provider.facebook:
        ({ provider_id, name } =
          await this.facebookService.getProfileByToken(accessToken));
        break;
      case Provider.apple:
        {
          name = this.getFullName(userInfo);
          ({ provider_id } =
            await this.appleService.getProfileByToken(accessToken));
        }
        break;
      default:
        throw new CustomError(RESULT_CODE.UNSUPPORTED_PROVIDER);
    }
    user = await this.userQuery.findOneByTokenAndProvider(
      provider_id,
      provider
    );
    if (!user) {
      const newUser = this.userFactory.create({
        provider: provider,
        token: provider_id,
        nickname: name
      });
      user = await this.userRepository.saveEntity(newUser);
    }

    if (!user) {
      throw new CustomError(RESULT_CODE.NOT_FOUND_USER);
    }

    const access_token = await this.jwtService.signAsync(
      {
        type: LoginType.USER,
        id: user.id,
        signname: user.token
      },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
      }
    );
    await this.cacheService.setCache(`USER:${user.id}`, access_token, 0);
    return access_token;
  }
}
