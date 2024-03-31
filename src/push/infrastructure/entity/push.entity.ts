import { BaseEntity } from './base.entity';

export enum UserPushTokenPlatformType {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
  WEB = 'WEB',
  OTHER = 'OTHER'
}

export class PushEntity extends BaseEntity {
  user_id: number;

  serial: string;

  token: string;

  platform: UserPushTokenPlatformType;
}
