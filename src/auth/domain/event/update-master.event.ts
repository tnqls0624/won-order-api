import { IEvent } from '@nestjs/cqrs';
import { UpdateMasterDto } from 'src/auth/interface/dto/req/update-master.dto';
import { CqrsEvent } from 'src/event/cqrs-events';

export class UpdateMasterEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly body: UpdateMasterDto
  ) {
    super(UpdateMasterEvent.name);
  }
}
