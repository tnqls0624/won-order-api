import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  OrderValidationImplement,
  ORDER_VALIDATOR
} from 'libs/order-validation.module';
import { CacheService } from 'src/cache/service/cache.service';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { InjectionToken } from '../Injection-token';
import { FindAllUserMenuQuery } from './find-all-user-menu.query';
import { MenuQuery } from './menu.query';

@QueryHandler(FindAllUserMenuQuery)
export class FindAllUserMenuQueryHandler
  implements IQueryHandler<FindAllUserMenuQuery>
{
  constructor(
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.MENU_QUERY)
    readonly menuQuery: MenuQuery,
    @Inject(ORDER_VALIDATOR)
    private readonly orderValidator: OrderValidationImplement
  ) {}

  private readonly logger = new Logger(FindAllUserMenuQueryHandler.name);
  async execute(query: FindAllUserMenuQuery) {
    const { market_id, language_code } = query;
    try {
      const caching_menus = await this.cacheService.getCache(
        `/menu/user/all?market_id=${market_id}&language_code=${language_code}`
      );
      if (caching_menus) return caching_menus;
      const menus = await this.menuQuery.findAllUserMenu(
        market_id,
        language_code
      );

      if (!menus) throw new CustomError(RESULT_CODE.NOT_FOUND_MENU);
      await Promise.all(
        menus.map(async (group: any) => {
          const signature_dishes_for_group: any[] = [];

          group.menu_category.forEach((menu_category: { menu: any[] }) => {
            const active_menus = menu_category.menu.filter(
              (menu: { is_active: boolean }) => menu.is_active
            );
            signature_dishes_for_group.push(...active_menus);
          });

          group.signature_dishes = signature_dishes_for_group;

          group.is_active = await this.orderValidator.menuValidation(group.id);
        })
      );
      await this.cacheService.setCache(
        `/menu/user/all?market_id=${market_id}`,
        menus,
        0
      );
      return menus;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
}
