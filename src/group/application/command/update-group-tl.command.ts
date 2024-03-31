import { ICommand } from '@nestjs/cqrs';
import { UpdateGroupTlsDto } from 'src/group/interface/dto/update-group-tl.dto';

export class UpdateGroupTlCommand implements ICommand {
  constructor(readonly body: UpdateGroupTlsDto) {}
}
