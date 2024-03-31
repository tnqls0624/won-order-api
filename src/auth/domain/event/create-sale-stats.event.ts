import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';

export class CreateSaleStatsEvent extends CqrsEvent implements IEvent {
  constructor(readonly market_id: number, readonly group_id: string, readonly geo: string) {
    super(CreateSaleStatsEvent.name);
  }
}
