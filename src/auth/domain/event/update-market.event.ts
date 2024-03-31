import { IEvent } from '@nestjs/cqrs';
import { UpdateMarketDto } from 'src/auth/interface/dto/req/update-market.dto';
import { CqrsEvent } from 'src/event/cqrs-events';

export class UpdateMarketEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly body: UpdateMarketDto
  ) {
    super(UpdateMarketEvent.name);
  }
}
