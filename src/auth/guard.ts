import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { LoginType } from 'src/types/login.type';
import { Payload } from './jwt.strategy';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly jwtService: JwtService
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let token = request.headers['authorization'];
    if (token && token.startsWith('Bearer ')) token = token.slice(7);
    if (!token) throw new UnauthorizedException();

    const payload = this.jwtService.decode(token) as Payload;
    if (payload.type === LoginType.MASTER || payload.type === LoginType.SUPER)
      return super.canActivate(context) as Promise<boolean>;
    const token_in_redis = await this.cacheManager.get(
      `${payload?.type?.toUpperCase()}:${payload.id}`
    );
    if (token !== token_in_redis)
      throw new CustomError(RESULT_CODE.AUTH_OTHER_LOGGED_IN);
    return super.canActivate(context) as Promise<boolean>;
  }
}
