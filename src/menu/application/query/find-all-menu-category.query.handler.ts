import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { FindAllMenuCategoryQuery } from './find-all-menu-category.query';
import { MenuCategoryQuery } from './menu-category.query';

@QueryHandler(FindAllMenuCategoryQuery)
export class FindAllMenuCategoryQueryHandler
  implements IQueryHandler<FindAllMenuCategoryQuery>
{
  constructor(
    @Inject(InjectionToken.MENUCATEGORY_QUERY)
    readonly menuCategoryQuery: MenuCategoryQuery
  ) {}

  async execute(query: FindAllMenuCategoryQuery) {
    const { admin } = query;
    return this.menuCategoryQuery.findAll(admin.market_id);
  }
}
