import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { AdminRepository } from 'src/auth/domain/admin.repository';
import { UpdateAllOrderStatusEvent } from 'src/auth/domain/event/update-all-order-status.event';

@EventsHandler(UpdateAllOrderStatusEvent)
export class UpdateAllOrderStatusEventHandler
  implements IEventHandler<UpdateAllOrderStatusEvent>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository
  ) {}

  async handle(event: UpdateAllOrderStatusEvent) {
    const { market_id, group_id, status } = event;
    await this.adminRepository.updateAllOrderStatus(
      market_id,
      group_id,
      status
    );
  }
}
