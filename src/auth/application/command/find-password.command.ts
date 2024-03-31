import { ICommand } from '@nestjs/cqrs';
import { FindPasswordDto } from 'src/auth/interface/dto/req/find-password.dto';

export class FindPasswordCommand implements ICommand {
  constructor(readonly body: FindPasswordDto) {}
}
