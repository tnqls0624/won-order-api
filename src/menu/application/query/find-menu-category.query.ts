import { IQuery } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class FindMenuCategoryQuery implements IQuery {
  constructor(
    readonly admin: AdminDto,
    readonly id: number
  ) {}
}
