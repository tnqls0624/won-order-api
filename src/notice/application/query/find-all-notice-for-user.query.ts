import { IQuery } from '@nestjs/cqrs';

export class FindAllNoticeForUserQuery implements IQuery {
  constructor(readonly group_id: number) {}
}
