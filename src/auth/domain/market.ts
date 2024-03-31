import { AggregateRoot } from '@nestjs/cqrs';
import { Country } from '@prisma/client';
import { UpdateMarketDto } from '../interface/dto/req/update-market.dto';
import { UpdateMarketEvent } from './event/update-market.event';
import { DeleteMarketEvent } from './event/delete-market.event';

export type MarketEssentialProperties = Readonly<
  Required<{
    currency_id: number;
    language_id: number;
    name: string;
    access_id: string;
    country: Country;
    phone: string | null;
    email: string | null;
    create_at: Date;
    update_at: Date;
  }>
>;

export type MarketOptionalProperties = Readonly<
  Partial<{
    remove_at: Date | null;
  }>
>;

export type MarketProperties = Required<MarketEssentialProperties> &
  MarketOptionalProperties;

export interface Market {
  withdrawal: () => void;
  update: (body: UpdateMarketDto) => void;
}

export class MarketImplement extends AggregateRoot implements Market {
  private readonly id: number;
  private currency_id: number;
  private language_id: number;
  private name: string;
  private access_id: string;
  private country: Country;
  private phone: string;
  private email: string;
  private remove_at: Date | null;
  private create_at: Date;
  private update_at: Date;

  constructor(properties: MarketProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }
  update(body: UpdateMarketDto) {
    this.apply(new UpdateMarketEvent(this.id, body));
  }
  withdrawal() {
    this.apply(new DeleteMarketEvent(this.id));
  }
}
