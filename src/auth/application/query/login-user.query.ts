import { IQuery } from '@nestjs/cqrs';
import { LoginUserDto } from 'src/auth/interface/dto/req/login-user.dto';

export class LoginUserQuery implements IQuery {
  constructor(readonly body: LoginUserDto) {}
}
