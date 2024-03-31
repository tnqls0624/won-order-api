import { IQuery } from '@nestjs/cqrs';

export class FindGroupQuery implements IQuery {
  constructor(
    readonly id: number
  ) {}
}
