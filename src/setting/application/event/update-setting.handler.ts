import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateSettingEvent } from 'src/setting/domain/event/update-setting.event';
import { SettingRepository } from 'src/setting/domain/setting.repository';
import { InjectionToken } from '../Injection-token';

@EventsHandler(UpdateSettingEvent)
export class UpdateSettingEventHandler
  implements IEventHandler<UpdateSettingEvent>
{
  constructor(
    @Inject(InjectionToken.SETTING_REPOSITORY)
    private readonly settingRepository: SettingRepository
  ) {}

  async handle(event: UpdateSettingEvent) {
    const { id, admin, market_id, body } = event;
    await this.settingRepository.update(id, admin, market_id, body);
    return true;
  }
}
