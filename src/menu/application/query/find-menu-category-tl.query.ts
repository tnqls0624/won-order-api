import { IQuery } from '@nestjs/cqrs';

export class FindMenuCategoryTlQuery implements IQuery {
  constructor(readonly id: number) {}
}
