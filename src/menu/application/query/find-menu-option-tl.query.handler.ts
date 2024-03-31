import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { MenuQuery } from './menu.query';
import { FindMenuOptionTlQuery } from './find-menu-option-tl.query';

@QueryHandler(FindMenuOptionTlQuery)
export class FindMenuOptionTlQueryHandler
  implements IQueryHandler<FindMenuOptionTlQuery>
{
  constructor(
    @Inject(InjectionToken.MENU_QUERY)
    readonly menuQuery: MenuQuery
  ) {}

  async execute(query: FindMenuOptionTlQuery) {
    const { id } = query;
    return this.menuQuery.findMenuOptionTl(id);
  }
}
