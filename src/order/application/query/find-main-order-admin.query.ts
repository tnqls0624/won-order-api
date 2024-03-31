import { IQuery } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class FindMainOrderAdminQuery implements IQuery {
  constructor(
    readonly admin: AdminDto,
    readonly group_ids: string[] | undefined,
    readonly main_order_id: number,
    readonly order_menu_status: string
  ) {}
}
