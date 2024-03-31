import { IQuery } from '@nestjs/cqrs';
import { FindSalesParams } from 'src/order/interface/param/find-sales.params';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { PageOptionsDto } from 'src/utils/paginate/dto';

export class FindSalesQuery implements IQuery {
  constructor(
    readonly admin: AdminDto,
    readonly params: FindSalesParams,
    readonly page_option: PageOptionsDto
  ) {}
}
