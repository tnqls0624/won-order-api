import { Inject, Logger } from '@nestjs/common';
import { MainOrderStatus, PrismaClient } from '@prisma/client';
import CustomError from 'src/common/error/custom-error';
import { OrderMenuStatus } from 'src/order/infrastructure/entity/order-menu.entity';
import { TableQuery } from 'src/table/application/query/table.query';
import { MainOrderTypeEnum } from 'src/types';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/utils/paginate/dto';
import { CursorDto } from 'src/utils/paginate/dto/cursor.dto';

type OrderByTableCondition = {
  group_id?: 'asc' | 'desc';
  table_num?: 'asc' | 'desc';
};

export class TableQueryImplement implements TableQuery {
  private readonly logger = new Logger(TableQueryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findCustomQR(id: number): Promise<any> {
    const custom_qr = await this.prisma.custom_qr.findFirst({
      where: {
        id
      }
    });
    return custom_qr;
  }

  async findAllCustomQR(
    market_id: number,
    page_options: PageOptionsDto
  ): Promise<any> {
    try {
      const where_condition: any = {
        market_id
      };
      const orderBy: any[] = [
        {
          id: 'desc'
        }
      ];
      const cursor_conditions = this.pagedCondition(
        where_condition,
        page_options
      );
      const { skip, take, ...where } = cursor_conditions;

      const [custom_qrs, item_count] = await Promise.all([
        this.prisma.custom_qr.findMany({
          where,
          skip,
          take,
          orderBy
        }),
        this.prisma.custom_qr.count({
          where
        })
      ]);

      return this.performPagedQuery(custom_qrs, item_count, page_options);
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findById(id: number): Promise<any | null> {
    try {
      const entity = await this.prisma.table.findFirst({
        where: {
          id,
          group: {
            remove_at: null
          },
          market: {
            remove_at: null
          }
        },
        include: {
          group: true,
          market: true
        }
      });
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findByIdWithLanguageId(
    id: number,
    language_id: number
  ): Promise<any | null> {
    try {
      const entity = await this.prisma.table.findFirst({
        where: {
          id,
          group: {
            remove_at: null
          },
          market: {
            remove_at: null
          }
        },
        include: {
          group: {
            include: {
              group_tl: {
                where: {
                  language_id
                }
              }
            }
          },
          market: true
        }
      });

      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findByNumWithLanguageGroupId(
    table_num: string,
    group_id: number,
    language_id: number
  ): Promise<any> {
    try {
      const entity = await this.prisma.table.findFirst({
        where: {
          group_id,
          table_num: String(table_num)
        },
        include: {
          group: {
            include: {
              group_tl: {
                where: {
                  language_id
                }
              }
            }
          },
          market: true
        }
      });
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findAll(
    market_id: number,
    group_id: number,
    language_id: number,
    page_options: PageOptionsDto
  ): Promise<any> {
    try {
      const where_condition: any = {
        market_id,
        remove_at: null,
        ...(group_id && { group_id: group_id }),
        group: {
          remove_at: null
        },
        market: {
          remove_at: null
        }
      };
      const orderBy: OrderByTableCondition[] = [
        {
          group_id: 'desc'
        },
        {
          table_num: 'asc'
        }
      ];

      const cursor_conditions = await this.pagedCondition(
        where_condition,
        page_options
      );
      const { skip, take, ...where } = cursor_conditions;
      const [tables, item_count] = await Promise.all([
        this.prisma.table.findMany({
          where,
          include: {
            group: {
              include: {
                group_tl: {
                  where: {
                    language_id
                  }
                }
              }
            }
          },
          skip,
          take,
          orderBy
        }),
        this.prisma.table.count({
          where
        })
      ]);
      return this.performPagedQuery(tables, item_count, page_options);
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findAllForEmployee(admin: AdminDto): Promise<any | null> {
    try {
      const { market_id, language_id } = admin;
      const selected_group_ids_set = new Set(
        admin.admin_group
          .filter((group) => group.selected)
          .map((group) => group.group.id)
      );
      let groups = await this.prisma.group.findMany({
        where: { market_id, remove_at: null, market: { remove_at: null } },
        include: {
          group_tl: {
            where: {
              language_id
            }
          },
          table: {
            include: {
              main_order: {
                where: {
                  type: MainOrderTypeEnum.HALL,
                  status: {
                    in: [MainOrderStatus.WAIT, MainOrderStatus.PROGRESS]
                  }
                },
                include: {
                  order: {
                    include: {
                      order_group: {
                        where: {
                          group_id: {
                            in: [...selected_group_ids_set]
                          }
                        },
                        include: {
                          order_menu: true
                        }
                      }
                    },
                    orderBy: [{ id: 'desc' }]
                  }
                },
                orderBy: [{ id: 'desc' }],
                take: 1
              }
            }
          }
        },
        orderBy: [{ id: 'asc' }]
      });

      groups = groups.map((group) => ({
        ...group,
        status: group.table.some(
          (table) =>
            table.main_order[0] &&
            table.main_order[0].order.some((order) =>
              order.order_group.some(
                (order_group) =>
                  selected_group_ids_set.has(order_group.group_id) &&
                  order_group.order_menu.some(
                    (menu) => menu.status === OrderMenuStatus.WAIT
                  )
              )
            )
        )
          ? 'NEW'
          : ''
      }));

      return groups;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private pagedCondition(where_conditions: any, page_options: PageOptionsDto) {
    const { limit, page, cursor } = page_options;
    const cursor_flag = !page && page === undefined;

    const page_flag = !cursor_flag && page && page !== undefined;
    const skip = page_flag ? (page - 1) * limit : 0;

    const cursor_where_conditions = {
      ...where_conditions,
      ...(cursor_flag ? { id: { lt: cursor } } : {})
    };
    const cursor_conditions: any = {
      ...cursor_where_conditions,
      skip,
      take: limit
    };
    return cursor_conditions;
  }

  private performPagedQuery(
    entities: any,
    item_count: number,
    page_options: PageOptionsDto
  ) {
    if (page_options.page) {
      const pageMetaDto: PageMetaDto = new PageMetaDto({
        pageOptionsDto: page_options,
        itemCount: item_count
      });
      return new PageDto(entities, pageMetaDto);
    }
    const itemCount = item_count;

    const next_cursor =
      entities.length === +page_options.limit
        ? (entities[entities.length - 1].id as number) - 1
        : null;
    return new CursorDto(entities, next_cursor, itemCount);
  }
}
