import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TableRepository } from 'src/table/domain/table.repository';
import { DeleteTableEvent } from 'src/table/domain/event/delete-table.event';
import { InjectionToken } from '../Injection-token';

@EventsHandler(DeleteTableEvent)
export class DeleteTableHandler implements IEventHandler<DeleteTableEvent> {
  constructor(
    @Inject(InjectionToken.TABLE_REPOSITORY)
    private readonly tableRepository: TableRepository
  ) {}

  async handle(event: DeleteTableEvent) {
    const { id } = event;
    await this.tableRepository.delete(id);
  }
}
