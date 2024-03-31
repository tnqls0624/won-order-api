import { AggregateRoot } from '@nestjs/cqrs';

export type LogoEssentialProperties = Readonly<
  Required<{
    setting_id: number;
    hash: string;
    w120: string;
    w360: string;
  }>
>;

export type ImageOptionalProperties = Readonly<
  Partial<{
    create_at: Date;
    update_at: Date;
  }>
>;

export type LogoProperties = LogoEssentialProperties &
  Required<ImageOptionalProperties>;

export interface Logo {}

export class LogoImplement extends AggregateRoot implements Logo {
  private readonly id: number;
  private setting_id: number;
  private hash: string;
  private w120: string;
  private w360: string;
  private create_at: Date;
  private update_at: Date;

  constructor(properties: LogoProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }
}
