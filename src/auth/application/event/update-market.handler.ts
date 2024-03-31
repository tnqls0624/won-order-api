import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { UpdateMarketEvent } from 'src/auth/domain/event/update-market.event';
import { MarketRepository } from 'src/auth/domain/market.repository';

@EventsHandler(UpdateMarketEvent)
export class UpdateMarketEventHandler
  implements IEventHandler<UpdateMarketEvent>
{
  constructor(
    @Inject(InjectionToken.MARKET_REPOSITORY)
    private readonly marketRepository: MarketRepository
  ) {}

  async handle(event: UpdateMarketEvent) {
    const { id, body } = event;
    await this.marketRepository.update(id, body);
  }
}
