import { IQuery } from '@nestjs/cqrs';

export class FindDocumentQuery implements IQuery {
  constructor(readonly id: number) {}
}
