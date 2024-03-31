import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { UpdateEmployeeEvent } from 'src/auth/domain/event/update-employee.event';
import { AdminRepository } from 'src/auth/domain/admin.repository';

@EventsHandler(UpdateEmployeeEvent)
export class UpdateEmployeeHandler
  implements IEventHandler<UpdateEmployeeEvent>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository
  ) {}

  async handle(event: UpdateEmployeeEvent) {
    const { id, body } = event;
    await this.adminRepository.update(id, body);
    return true;
  }
}
