import { IQuery } from '@nestjs/cqrs';

export class FindMenuOptionTlQuery implements IQuery {
  constructor(readonly id: number) {}
}
