import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OrderMenuStatus } from 'src/order/infrastructure/entity/order-menu.entity';
import { InjectionToken } from '../injection-token';
import { FindMainOrderQuery } from './find-main-order.query';
import { MainOrderQuery } from './main-order.query';

@QueryHandler(FindMainOrderQuery)
export class FindMainOrderQueryHandler
  implements IQueryHandler<FindMainOrderQuery>
{
  constructor(
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    readonly mainOrderQuery: MainOrderQuery
  ) {}

  async execute(query: FindMainOrderQuery) {
    const { id, order_menu_status, language_code } = query;
    return this.mainOrderQuery.findById(
      id,
      order_menu_status as OrderMenuStatus,
      language_code
    );
  }
}
