import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateAdminPasswordEvent } from 'src/auth/domain/event/update-admin-password.event';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { AdminRepository } from 'src/auth/domain/admin.repository';

@EventsHandler(UpdateAdminPasswordEvent)
export class UpdateAdminPasswordHandler
  implements IEventHandler<UpdateAdminPasswordEvent>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository
  ) {}

  async handle(event: UpdateAdminPasswordEvent) {
    const { id, password } = event;
    await this.adminRepository.updatePassword(id, password);
  }
}
