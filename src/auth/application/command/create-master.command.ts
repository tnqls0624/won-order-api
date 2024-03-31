import { ICommand } from '@nestjs/cqrs';
import { CreateMasterDto } from 'src/auth/interface/dto/req/create-master.dto';

export class CreateMasterCommand implements ICommand {
  constructor(readonly body: CreateMasterDto) {}
}
