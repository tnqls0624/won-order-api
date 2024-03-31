import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';
import { FindPasswordDto } from '../../interface/dto/find-password.dto';

export class FindPasswordEvent extends CqrsEvent implements IEvent {
  constructor(readonly body: FindPasswordDto) {
    super(FindPasswordEvent.name);
  }
}
