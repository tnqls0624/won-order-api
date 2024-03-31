import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Payload } from '@prisma/client/runtime/library';
import { Reflector } from '../../../libs/reflector';
import { LoginType } from '../../types/login.type';

export const UserInfo = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const jwtService = Reflector.getJwtService();
    const userRepository = Reflector.getUserRepository();

    let token = request.headers['authorization'];
    if (token && token.startsWith('Bearer ')) token = token.slice(7);
    if (!token) return null;
    const payload = jwtService.decode(token) as Payload<any>;
    const { signname, type } = payload;
    if (type === LoginType.USER) {
      return await userRepository.validateUser(signname);
    }
    return null;
  }
);
