import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { CreateNoticeDto } from '../../interface/dto/create-notice.dto';

export class CreateNoticeCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly body: CreateNoticeDto
  ) {}
}
