import { IQuery } from '@nestjs/cqrs';

export class FindMenuOptionCategoryTlQuery implements IQuery {
  constructor(readonly id: number) {}
}
