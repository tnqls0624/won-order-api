import { ICommand } from '@nestjs/cqrs';
import { UpdatePasswordDto } from 'src/auth/interface/dto/req/password-change.dto';
import { AdminDto } from '../../interface/dto/model/admin.dto';

export class UpdateAdminPasswordCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly body: UpdatePasswordDto
  ) {}
}
