import { ICommand } from '@nestjs/cqrs';
import { UpdateMasterDto } from 'src/auth/interface/dto/req/update-master.dto';

export class UpdateMasterCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly body: UpdateMasterDto
  ) {}
}
