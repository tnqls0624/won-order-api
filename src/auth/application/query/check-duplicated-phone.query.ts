import { IQuery } from '@nestjs/cqrs';

export class CheckDuplicatedPhoneQuery implements IQuery {
  constructor(readonly phone: string) {}
}
