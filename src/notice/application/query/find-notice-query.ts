import { IQuery } from '@nestjs/cqrs';

export class FindNoticeQuery implements IQuery {
  constructor(readonly id: number) {}
}
