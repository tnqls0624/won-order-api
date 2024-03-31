import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { UpdateGroupDto } from '../../interface/dto/update-group.dto';

export class UpdateGroupCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly id: number,
    readonly body: UpdateGroupDto
  ) {}
}
