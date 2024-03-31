import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { FindAllMenuQuery } from './find-all-menu.query';
import { MenuQuery } from './menu.query';

@QueryHandler(FindAllMenuQuery)
export class FindAllMenuQueryHandler
  implements IQueryHandler<FindAllMenuQuery>
{
  constructor(
    @Inject(InjectionToken.MENU_QUERY)
    readonly menuQuery: MenuQuery
  ) {}

  async execute(query: FindAllMenuQuery) {
    const { admin, id, status } = query;
    console.log(id)
    return this.menuQuery.findAllAdminMenu(id, admin.market_id, status);
  }
}
