import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { MenuQuery } from './menu.query';
import { FindMenuOptionCategoryTlQuery } from './find-menu-option-category-tl.query';

@QueryHandler(FindMenuOptionCategoryTlQuery)
export class FindMenuOptionCategoryTlQueryHandler
  implements IQueryHandler<FindMenuOptionCategoryTlQuery>
{
  constructor(
    @Inject(InjectionToken.MENU_QUERY)
    readonly menuQuery: MenuQuery
  ) {}

  async execute(query: FindMenuOptionCategoryTlQuery) {
    const { id } = query;
    return this.menuQuery.findMenuOptionCategoryTl(id);
  }
}
