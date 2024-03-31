import { AggregateRoot } from '@nestjs/cqrs';
import { UserPushTokenPlatformType } from '../infrastructure/entity/push.entity';

export type PushEssentialProperties = Readonly<
  Required<{
    serial: string;
    platform: UserPushTokenPlatformType;
    user_id: number;
    token: string;
  }>
>;

export type PushOptionalProperties = Readonly<
  Partial<{
    remove_at: Date | null;
    create_at: Date;
    update_at: Date;
  }>
>;

export type PushProperties = PushEssentialProperties &
  Required<PushOptionalProperties>;

export interface Push {}

export class PushImplement extends AggregateRoot implements Push {
  private readonly id: number;
  private user_id: number;
  private token: string;
  private serial: string;
  private platform: UserPushTokenPlatformType;
  private create_at: Date;
  private update_at: Date;
  private remove_at: Date | null;

  constructor(properties: PushProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }
}
