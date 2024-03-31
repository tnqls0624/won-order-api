import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from 'src/event/cqrs-events';
import { UpdateSettingDto } from 'src/setting/interface/dto/update-setting.dto';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class UpdateSettingEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly admin: AdminDto,
    readonly market_id: number,
    readonly body: UpdateSettingDto
  ) {
    super(UpdateSettingEvent.name);
  }
}
