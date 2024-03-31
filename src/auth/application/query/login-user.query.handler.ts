import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserQuery } from 'src/auth/application/query/user.query';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { CacheService } from 'src/cache/service/cache.service';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { LoginType } from 'src/types/login.type';
import { LoginUserQuery } from './login-user.query';

@QueryHandler(LoginUserQuery)
export class LoginQueryHandler implements IQueryHandler<LoginUserQuery> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.USER_QUERY)
    readonly userQuery: UserQuery
  ) {}

  async execute(query: LoginUserQuery) {
    const { body } = query;
    const { phone, password } = body;
    if (!phone) throw new CustomError(RESULT_CODE.AUTH_NEED_PHONE_NUMBER);
    if (!password) throw new CustomError(RESULT_CODE.AUTH_NEED_PASSWORD);
    const user = await this.userQuery.findByPhone(phone);
    if (!user) throw new CustomError(RESULT_CODE.NOT_FOUND_USER);
    const bcrypt_password = await bcrypt.compare(password, user.password);
    if (!bcrypt_password)
      throw new CustomError(RESULT_CODE.AUTH_INVALID_USER_PASSWORD);

    const access_token = await this.jwtService.signAsync(
      {
        type: LoginType.USER,
        id: user.id,
        signname: user.phone
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
