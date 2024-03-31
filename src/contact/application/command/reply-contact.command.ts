import { ICommand } from '@nestjs/cqrs';
import { ReplyContactDto } from '../../interface/dto/reply-contact.dto';
import { AdminDto } from '../../../auth/interface/dto/model/admin.dto';

export class ReplyContactCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly body: ReplyContactDto,
    readonly admin: AdminDto
  ) {}
}
