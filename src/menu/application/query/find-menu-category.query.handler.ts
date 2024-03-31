import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { FindMenuCategoryQuery } from './find-menu-category.query';
import { MenuCategoryQuery } from './menu-category.query';

@QueryHandler(FindMenuCategoryQuery)
export class FindMenuCategoryQueryHandler
  implements IQueryHandler<FindMenuCategoryQuery>
{
  constructor(
    @Inject(InjectionToken.MENUCATEGORY_QUERY)
    readonly menuCategoryQuery: MenuCategoryQuery
  ) {}

  async execute(query: FindMenuCategoryQuery) {
    const { admin, id } = query;
    return this.menuCategoryQuery.findById(admin, id);
  }
}
