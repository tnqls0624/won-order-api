import { IQuery } from '@nestjs/cqrs';

export class FindMenuTlQuery implements IQuery {
  constructor(readonly id: number) {}
}
