import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { CreateSaleStatsEvent } from 'src/auth/domain/event/create-sale-stats.event';
import { AdminRepository } from 'src/auth/domain/admin.repository';

@EventsHandler(CreateSaleStatsEvent)
export class CreateSaleStatsEventHandler
  implements IEventHandler<CreateSaleStatsEvent>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository
  ) {}

  async handle(event: CreateSaleStatsEvent) {
    const { market_id, group_id, geo } = event;
    await this.adminRepository.createSaleStats(market_id, group_id, geo);
  }
}
