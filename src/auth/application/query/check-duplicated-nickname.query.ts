import { IQuery } from '@nestjs/cqrs';

export class CheckDuplicatedNickNameQuery implements IQuery {
  constructor(readonly nickname: string) {}
}
