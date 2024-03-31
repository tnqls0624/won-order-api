import { IQuery } from '@nestjs/cqrs';

export class FindTableQuery implements IQuery {
  constructor(readonly id: number) {}
}
