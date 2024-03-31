import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';
import { UpdateMenuDto } from 'src/menu/interface/dto/update-menu.dto';

export class UpdateMenuEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly market_id: number,
    readonly id: number,
    readonly body: UpdateMenuDto
  ) {
    super(UpdateMenuEvent.name);
  }
}
