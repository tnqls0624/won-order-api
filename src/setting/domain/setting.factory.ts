import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Setting, SettingImplement, SettingProperties } from './setting';

type CreateSettingOptions = Readonly<{
  market_id: number;
  group_id: number;
  wifi_ssid: string;
  wifi_password: string;
  start_business_hours: string;
  end_business_hours: string;
  start_break_time: string;
  end_break_time: string;
  comment: string;
  tel: string;
  text_color: string;
  background_color: string;
}>;

export class SettingFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateSettingOptions): Setting {
    return this.eventPublisher.mergeObjectContext(
      new SettingImplement({
        ...options,
        create_at: new Date(),
        update_at: new Date()
      })
    );
  }

  reconstitute(properties: SettingProperties): Setting {
    return this.eventPublisher.mergeObjectContext(
      new SettingImplement(properties)
    );
  }
}
