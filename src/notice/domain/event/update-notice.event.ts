import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';
import { UpdateNoticeDto } from '../../interface/dto/update-notice.dto';

export class UpdateNoticeEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly body: UpdateNoticeDto
  ) {
    super(UpdateNoticeEvent.name);
  }
}
