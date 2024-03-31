import { IQuery } from '@nestjs/cqrs';

export class FindAllPrintQuery implements IQuery {
  constructor(
    readonly market_id: number,
    readonly group_id: number
  ) {}
}
