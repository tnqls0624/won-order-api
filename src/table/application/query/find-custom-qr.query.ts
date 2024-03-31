import { IQuery } from '@nestjs/cqrs';

export class FindCustomQRQuery implements IQuery {
  constructor(readonly id: number) {}
}
