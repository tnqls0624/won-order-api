import { ICommand } from '@nestjs/cqrs';
import { UpdateNoticeDto } from '../../interface/dto/update-notice.dto';

export class UpdateNoticeCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly body: UpdateNoticeDto
  ) {}
}
