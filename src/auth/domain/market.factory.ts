import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Market, MarketImplement, MarketProperties } from './market';
import { Country } from '@prisma/client';

type CreateMarketOptions = Readonly<{
  currency_id: number;
  language_id: number;
  name: string;
  access_id: string;
  country: Country;
  phone: string | null;
  email: string | null;
}>;

export class MarketFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateMarketOptions): Market {
    return this.eventPublisher.mergeObjectContext(
      new MarketImplement({
        ...options,
        create_at: new Date(),
        update_at: new Date(),
        remove_at: null
      })
    );
  }

  reconstitute(properties: MarketProperties): Market {
    return this.eventPublisher.mergeObjectContext(
      new MarketImplement(properties)
    );
  }
}
