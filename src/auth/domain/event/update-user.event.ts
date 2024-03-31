import { IEvent } from '@nestjs/cqrs';
import { UpdateAuthDto } from 'src/auth/interface/dto/req/update-auth.dto';
import { CqrsEvent } from 'src/event/cqrs-events';

export class UpdateUserEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly body: UpdateAuthDto
  ) {
    super(UpdateUserEvent.name);
  }
}
