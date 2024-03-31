import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { UpdateSelectGroupDto } from '../../interface/dto/update-select-group.dto';

export class SelectGroupCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly body: UpdateSelectGroupDto
  ) {}
}
