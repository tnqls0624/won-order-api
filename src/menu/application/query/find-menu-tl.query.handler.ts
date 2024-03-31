import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { FindMenuTlQuery } from './find-menu-tl.query';
import { MenuQuery } from './menu.query';

@QueryHandler(FindMenuTlQuery)
export class FindMenuTlQueryHandler implements IQueryHandler<FindMenuTlQuery> {
  constructor(
    @Inject(InjectionToken.MENU_QUERY)
    readonly menuQuery: MenuQuery
  ) {}

  async execute(query: FindMenuTlQuery) {
    const { id } = query;
    return this.menuQuery.findMenuTl(id);
  }
}
