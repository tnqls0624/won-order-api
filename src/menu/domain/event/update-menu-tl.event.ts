import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';
import { UpdateMenuTlsDto } from 'src/menu/interface/dto/update-menu-tl.dto';

export class UpdateMenuTlEvent extends CqrsEvent implements IEvent {
  constructor(readonly body: UpdateMenuTlsDto) {
    super(UpdateMenuTlEvent.name);
  }
}
