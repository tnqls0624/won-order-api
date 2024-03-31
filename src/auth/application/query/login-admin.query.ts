import { IQuery } from '@nestjs/cqrs';
import { LoginAdminDto } from 'src/auth/interface/dto/req/login-admin.dto';
import { AdminType } from 'src/types/login.type';

export class LoginAdminQuery implements IQuery {
  constructor(
    readonly type: AdminType,
    readonly body: LoginAdminDto
  ) {}
}
