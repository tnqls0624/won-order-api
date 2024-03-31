import { IQuery } from '@nestjs/cqrs';
import { AdminDto } from '../../interface/dto/model/admin.dto';

export class FindAllUserQuery implements IQuery {
  constructor(
    readonly admin: AdminDto,
    readonly phone: string,
    readonly name: string
  ) {}
}
