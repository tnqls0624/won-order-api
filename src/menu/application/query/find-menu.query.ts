import { IQuery } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class FindMenuQuery implements IQuery {
  constructor(
    readonly admin: AdminDto,
    readonly id: number
  ) {}
}
