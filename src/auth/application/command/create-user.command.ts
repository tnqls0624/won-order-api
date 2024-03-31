import { ICommand } from '@nestjs/cqrs';
import { CreateUserDto } from 'src/auth/interface/dto/req/create-user.dto';

export class CreateUserCommand implements ICommand {
  constructor(readonly body: CreateUserDto) {}
}
