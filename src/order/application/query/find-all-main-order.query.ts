import { IQuery } from '@nestjs/cqrs';
import { FindOrdersParams } from 'src/order/interface/param/find-orders.params';
import { PageOptionsDto } from 'src/utils/paginate/dto';

export class FindAllMainOrdersQuery implements IQuery {
  constructor(
    readonly user_id: number,
    readonly params: FindOrdersParams,
    readonly page_options: PageOptionsDto
  ) {}
}
