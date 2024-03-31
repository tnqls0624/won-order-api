import { ICommand } from '@nestjs/cqrs';
import { UpdatePasswordDto } from 'src/auth/interface/dto/req/password-change.dto';

export class UpdateUserPasswordCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly body: UpdatePasswordDto
  ) {}
}
