import { IQuery } from '@nestjs/cqrs';

export class FindAllUserMenuQuery implements IQuery {
  constructor(
    readonly market_id: number,
    readonly language_code: string
  ) {}
}
