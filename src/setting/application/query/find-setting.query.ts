import { IQuery } from '@nestjs/cqrs';

export class FindSettingQuery implements IQuery {
  constructor(readonly id: number) {}
}
