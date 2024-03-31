import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { FindMenuQuery } from './find-menu.query';
import { MenuQuery } from './menu.query';

@QueryHandler(FindMenuQuery)
export class FindMenuQueryHandler implements IQueryHandler<FindMenuQuery> {
  constructor(
    @Inject(InjectionToken.MENU_QUERY)
    readonly menuQuery: MenuQuery
  ) {}

  async execute(query: FindMenuQuery) {
    const { admin, id } = query;
    return this.menuQuery.findById(admin, id);
  }
}
