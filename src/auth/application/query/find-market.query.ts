import { IQuery } from '@nestjs/cqrs';

export class FindMarketQuery implements IQuery {
  constructor(readonly id: number) {}
}
