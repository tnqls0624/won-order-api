import { ICommand } from '@nestjs/cqrs';
import { UpdateNoticeIndexesDto } from '../../interface/dto/update-notice-index.dto';

export class UpdateNoticeIndexCommand implements ICommand {
  constructor(readonly body: UpdateNoticeIndexesDto) {}
}
