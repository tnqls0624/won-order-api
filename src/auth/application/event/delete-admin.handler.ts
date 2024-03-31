import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { DeleteAdminEvent } from 'src/auth/domain/event/delete-admin.event';
import { AdminRepository } from 'src/auth/domain/admin.repository';

@EventsHandler(DeleteAdminEvent)
export class DeleteAdminHandler implements IEventHandler<DeleteAdminEvent> {
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository
  ) {}

  async handle(event: DeleteAdminEvent) {
    const { id } = event;
    await this.adminRepository.delete(id);
  }
}
