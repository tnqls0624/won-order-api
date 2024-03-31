import { AggregateRoot } from '@nestjs/cqrs';
import { UpdateSettingDto } from '../interface/dto/update-setting.dto';
import { UpdateSettingEvent } from './event/update-setting.event';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export type SettingEssentialProperties = Readonly<
  Required<{
    market_id: number;
    group_id: number;
  }>
>;

export type SettingOptionalProperties = Readonly<
  Partial<{
    wifi_ssid?: string;
    wifi_password?: string;
    start_business_hours?: string;
    end_business_hours?: string;
    start_break_time?: string;
    end_break_time?: string;
    settlement_time?: string;
    comment?: string;
    tel?: string;
    text_color: string;
    background_color: string;
    create_at: Date;
    update_at: Date;
  }>
>;

export type SettingProperties = SettingEssentialProperties &
  Required<SettingOptionalProperties>;

export interface Setting {
  update: (admin: AdminDto, body: UpdateSettingDto) => void;
}

export class SettingImplement extends AggregateRoot implements Setting {
  private readonly id: number;
  private market_id: number;
  private group_id: number;
  private wifi_ssid?: string;
  private wifi_password?: string;
  private start_business_hours?: string;
  private end_business_hours?: string;
  private start_break_time?: string;
  private end_break_time?: string;
  private settlement_time?: string;
  private comment?: string;
  private tel: string;
  private text_color?: string;
  private background_color?: string;
  private create_at: Date;
  private update_at: Date;

  constructor(properties: SettingProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }

  update(admin: AdminDto, body: UpdateSettingDto) {
    this.apply(new UpdateSettingEvent(this.id, admin, this.market_id, body));
  }
}
