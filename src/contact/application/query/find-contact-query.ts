import { IQuery } from '@nestjs/cqrs';

export class FindContactQuery implements IQuery {
  constructor(readonly id: number) {}
}
