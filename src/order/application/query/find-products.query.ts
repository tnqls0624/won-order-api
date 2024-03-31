import { IQuery } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class FindProductsQuery implements IQuery {
  constructor(
    readonly admin: AdminDto,
    readonly order_menu_stats_id: number,
    readonly group_id: string
  ) {}
}
