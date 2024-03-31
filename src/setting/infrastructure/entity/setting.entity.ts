import { BaseEntity } from './base.entity';

export class SettingEntity extends BaseEntity {
  market_id: number;

  group_id: number;

  wifi_ssid: string;

  wifi_password: string;

  start_business_hours: string;

  end_business_hours: string;

  start_break_time: string;

  end_break_time: string;

  settlement_time: string;

  tel: string;

  comment: string;

  text_color: string;

  background_color: string;
}
