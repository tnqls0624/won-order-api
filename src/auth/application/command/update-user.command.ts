import { ICommand } from '@nestjs/cqrs';
import { UpdateAuthDto } from '../../interface/dto/req/update-auth.dto';

export class UpdateUserCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly body: UpdateAuthDto
  ) {}
}
