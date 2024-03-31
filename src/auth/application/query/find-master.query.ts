import { IQuery } from '@nestjs/cqrs';

export class FindMasterQuery implements IQuery {
  constructor(readonly id: number) {}
}
