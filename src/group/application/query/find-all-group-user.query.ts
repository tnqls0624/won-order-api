import { IQuery } from '@nestjs/cqrs';

export class FindAllGroupUserQuery implements IQuery {
  constructor(readonly market_id: number) {}
}
