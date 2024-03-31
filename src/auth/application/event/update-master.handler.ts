import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { AdminRepository } from 'src/auth/domain/admin.repository';
import { UpdateMasterEvent } from 'src/auth/domain/event/update-master.event';

@EventsHandler(UpdateMasterEvent)
export class UpdateMasterEventHandler
  implements IEventHandler<UpdateMasterEvent>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository
  ) {}

  async handle(event: UpdateMasterEvent) {
    const { id, body } = event;
    await this.adminRepository.updateMaster(id, body);
    return true;
  }
}
