import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { MenuQuery } from './menu.query';
import { FindMenuCategoryTlQuery } from './find-menu-category-tl.query';

@QueryHandler(FindMenuCategoryTlQuery)
export class FindMenuCategoryTlQueryHandler
  implements IQueryHandler<FindMenuCategoryTlQuery>
{
  constructor(
    @Inject(InjectionToken.MENU_QUERY)
    readonly menuQuery: MenuQuery
  ) {}

  async execute(query: FindMenuCategoryTlQuery) {
    const { id } = query;
    return this.menuQuery.findMenuCategoryTl(id);
  }
}
