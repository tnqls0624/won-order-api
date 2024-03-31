import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Table, TableImplement, TableProperties } from './table';

type CreateTableOptions = Readonly<{
  market_id: number;
  group_id: number;
  table_num: string;
  code: string;
}>;

export class TableFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateTableOptions): Table {
    return this.eventPublisher.mergeObjectContext(
      new TableImplement({
        ...options,
        remove_at: null,
        create_at: new Date(),
        update_at: new Date()
      })
    );
  }

  reconstitute(properties: TableProperties): Table {
    return this.eventPublisher.mergeObjectContext(
      new TableImplement(properties)
    );
  }
}
