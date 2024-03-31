import { IQuery } from '@nestjs/cqrs';

export class CheckDuplicatedIdQuery implements IQuery {
  constructor(
    readonly market_id: number,
    readonly admin_id: string
  ) {}
}
