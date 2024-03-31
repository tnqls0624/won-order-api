import { IQuery } from '@nestjs/cqrs';
import { FindOrdersAdminParams } from 'src/order/interface/param/find-orders-admin.params';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { PageOptionsDto } from 'src/utils/paginate/dto';

export class FindAllMainOrdersAdminQuery implements IQuery {
  constructor(
    readonly admin: AdminDto,
    readonly params: FindOrdersAdminParams,
    readonly page_options: PageOptionsDto
  ) {}
}
