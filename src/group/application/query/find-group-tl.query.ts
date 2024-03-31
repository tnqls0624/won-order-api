import { IQuery } from '@nestjs/cqrs';

export class FindGroupTlQuery implements IQuery {
  constructor(readonly id: number) {}
}
