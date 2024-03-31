import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { DeleteMarketEvent } from 'src/auth/domain/event/delete-market.event';
import { MarketRepository } from 'src/auth/domain/market.repository';

@EventsHandler(DeleteMarketEvent)
export class DeleteMarketEventHandler
  implements IEventHandler<DeleteMarketEvent>
{
  constructor(
    @Inject(InjectionToken.MARKET_REPOSITORY)
    private readonly marektRepository: MarketRepository
  ) {}

  async handle(event: DeleteMarketEvent) {
    const { id } = event;
    await this.marektRepository.delete(id);
  }
}
