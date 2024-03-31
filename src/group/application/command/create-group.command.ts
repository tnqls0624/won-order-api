import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { CreateGroupDto } from '../../interface/dto/create-group.dto';

export class CreateGroupCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly body: CreateGroupDto
  ) {}
}
