import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { MainOrderQuery } from 'src/order/application/query/main-order.query';
import {
  FindOrdersAdminParams,
  UserTypeEnum
} from 'src/order/interface/param/find-orders-admin.params';
import { FindOrdersParams } from 'src/order/interface/param/find-orders.params';
import { FindSalesParams } from 'src/order/interface/param/find-sales.params';
import { MainOrderTypeEnum } from 'src/types';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/utils/paginate/dto';
import { CursorDto } from 'src/utils/paginate/dto/cursor.dto';
import { MainOrderStatus } from '../entity/main-order.entity';
import { OrderMenuStatus } from '../entity/order-menu.entity';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { OrderGroupPaymentStatus } from '../entity/order-group-payment.entity';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Language } from 'src/auth/interface/dto/req/update-employee.dto';

dayjs.extend(timezone);
dayjs.extend(quarterOfYear);
dayjs.extend(utc);

export class MainOrderQueryImplement implements MainOrderQuery {
  private readonly logger = new Logger(MainOrderQueryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findMenus(id: number): Promise<any> {
    const main_order = await this.prisma.main_order.findFirst({
      where: {
        id
      },
      select: {
        order_group: {
          select: {
            order_menu: {
              select: {
                id: true
              }
            }
          }
        }
      }
    });
    const menu_ids = main_order?.order_group?.flatMap(
      (order_group) =>
        order_group?.order_menu?.map((order_menu) => order_menu.id)
    );
    return menu_ids;
  }

  async findMenuTypes(id: number): Promise<any> {
    const main_order = await this.prisma.main_order.findFirst({
      where: {
        id
      },
      select: {
        order_group_payment: {
          select: {
            pay_type: true
          }
        }
      }
    });
    return main_order;
  }

  async findAllPrintByMarketId(
    market_id: number,
    group_id: number
  ): Promise<any> {
    const print = await this.prisma.order_print.findMany({
      where: {
        market_id,
        group_id
      }
    });
    return print;
  }

  async findReceiptById(
    market_id: number,
    group_id: number,
    id: number,
    language_code: string
  ): Promise<any> {
    try {
      const language = await this.prisma.language.findFirst({
        where: {
          code: language_code as Language
        }
      });
      const main_order = await this.prisma.main_order.findFirst({
        where: {
          market_id,
          id,
          order_group_payment: {
            some: {
              group_id,
              status: OrderGroupPaymentStatus.PAID,
              order_group: {
                some: {
                  order_menu: {
                    some: {
                      status: OrderMenuStatus.COMPLETE
                    }
                  },
                  group_id
                }
              }
            }
          }
        },
        select: {
          id: true,
          market_id: true,
          user_id: true,
          guest_id: true,
          table_id: true,
          type: true,
          order_num: true,
          status: true,
          total: true,
          delivery_addr: true,
          currency_code: true,
          order_group_payment: {
            select: {
              id: true,
              pay_type: true,
              order_group: {
                select: {
                  order_menu: {
                    select: {
                      id: true,
                      order_group_id: true,
                      status: true,
                      sum: true,
                      original_amount: true,
                      quantity: true,
                      menu: {
                        select: {
                          menu_category: {
                            select: {
                              id: true,
                              menu_category_tl: {
                                select: {
                                  name: true
                                },
                                where: {
                                  language_id: language?.id
                                }
                              }
                            }
                          },
                          id: true,
                          amount: true,
                          menu_tl: {
                            select: {
                              name: true
                            },
                            where: {
                              language_id: language?.id
                            }
                          }
                        }
                      },
                      order_menu_option: {
                        select: {
                          id: true,
                          original_amount: true,
                          menu_option: {
                            select: {
                              id: true,
                              name: true,
                              amount: true,
                              menu_option_tl: {
                                select: {
                                  name: true
                                },
                                where: {
                                  language_id: language?.id
                                }
                              },
                              menu_option_category: {
                                select: {
                                  id: true,
                                  menu_option_category_tl: {
                                    select: {
                                      name: true
                                    },
                                    where: {
                                      language_id: language?.id
                                    }
                                  }
                                }
                              }
                            }
                          }
                        },
                        where: {
                          remove_at: null
                        },
                        orderBy: [{ id: 'desc' }]
                      }
                    },
                    where: {
                      remove_at: null
                    },
                    orderBy: [{ id: 'desc' }]
                  }
                },
                where: {
                  group_id
                }
              }
            },
            where: {
              group_id
            }
          },
          table: {
            select: {
              id: true,
              table_num: true,
              group: {
                select: {
                  setting: {
                    select: {
                      wifi_ssid: true,
                      wifi_password: true,
                      comment: true,
                      address: true
                    },
                    where: {
                      remove_at: null
                    }
                  },
                  group_tl: {
                    select: {
                      name: true
                    },
                    where: {
                      group_id,
                      language_id: language?.id
                    }
                  }
                },
                where: {
                  id: group_id,
                  remove_at: null
                }
              }
            },
            where: {
              remove_at: null
            }
          }
        }
      });
      if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);
      return main_order;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findDashboardSalesTotal(
    admin: AdminDto,
    time_zone: string
  ): Promise<any> {
    const start_of_month = dayjs().tz(time_zone).startOf('month').toDate();
    const end_of_month = dayjs().tz(time_zone).endOf('month').toDate();

    const start_of_week = dayjs().tz(time_zone).startOf('week').toDate();
    const end_of_week = dayjs().tz(time_zone).endOf('week').toDate();

    const start_of_today = dayjs().tz(time_zone).startOf('day').toDate();
    const end_of_today = dayjs().tz(time_zone).endOf('day').toDate();

    const start_of_last_30_days = dayjs()
      .tz(time_zone)
      .subtract(29, 'day')
      .startOf('day')
      .toDate();
    const end_of_last_30_days = dayjs().tz(time_zone).endOf('day').toDate();

    const yesterday = dayjs().tz(time_zone).subtract(1, 'day').startOf('day');
    const start_of_last_week_from_yesterday = yesterday
      .subtract(5, 'day')
      .toDate();

    const market = await this.prisma.market.findFirst({
      where: {
        id: admin.market_id
      },
      include: {
        language: true
      }
    });

    const groups = await this.prisma.group.findMany({
      where: {
        market_id: admin.market_id,
        remove_at: null
      },
      include: {
        group_tl: {
          where: {
            language_id: market?.language?.id
          }
        }
      }
    });

    const results: any = [];

    for (const group of groups) {
      const daily_sales: any = [];
      const month_sales_total = await this.prisma.order_group_payment.aggregate(
        {
          where: {
            group_id: group.id,
            status: OrderGroupPaymentStatus.PAID,
            order_group: {
              some: {
                order_menu: {
                  some: {
                    status: OrderMenuStatus.COMPLETE
                  }
                }
              }
            },
            create_at: {
              gte: start_of_month,
              lt: end_of_month
            },
            remove_at: null
          },
          _sum: {
            total: true
          }
        }
      );

      const week_sales_total = await this.prisma.order_group_payment.aggregate({
        where: {
          group_id: group.id,
          status: OrderGroupPaymentStatus.PAID,
          order_group: {
            some: {
              order_menu: {
                some: {
                  status: OrderMenuStatus.COMPLETE
                }
              }
            }
          },
          create_at: {
            gte: start_of_week,
            lt: end_of_week
          },
          remove_at: null
        },
        _sum: {
          total: true
        }
      });

      const last_30_days_sales_total =
        await this.prisma.order_group_payment.aggregate({
          where: {
            group_id: group.id,
            status: OrderGroupPaymentStatus.PAID,
            order_group: {
              some: {
                order_menu: {
                  some: {
                    status: OrderMenuStatus.COMPLETE
                  }
                }
              }
            },
            create_at: {
              gte: start_of_last_30_days,
              lt: end_of_last_30_days
            },
            remove_at: null
          },
          _sum: {
            total: true
          }
        });

      const today_sales_total = await this.prisma.order_group_payment.aggregate(
        {
          where: {
            group_id: group.id,
            status: OrderGroupPaymentStatus.PAID,
            order_group: {
              some: {
                order_menu: {
                  some: {
                    status: OrderMenuStatus.COMPLETE
                  }
                }
              }
            },
            create_at: {
              gte: start_of_today,
              lt: end_of_today
            },
            remove_at: null
          },
          _sum: {
            total: true
          }
        }
      );

      for (let day = 0; day < 7; day++) {
        const day_start = dayjs(start_of_last_week_from_yesterday)
          .tz(time_zone)
          .add(day, 'day')
          .toDate();
        const day_end = dayjs(day_start).tz(time_zone).endOf('day').toDate();

        const daily_sales_total =
          await this.prisma.order_group_payment.aggregate({
            where: {
              group_id: group.id,
              status: OrderGroupPaymentStatus.PAID,
              order_group: {
                some: {
                  order_menu: {
                    some: {
                      status: OrderMenuStatus.COMPLETE
                    }
                  }
                }
              },
              create_at: {
                gte: day_start,
                lt: day_end
              },
              remove_at: null
            },
            _sum: {
              total: true
            }
          });

        daily_sales.push({
          date: dayjs(day_start).format('YYYY-MM-DD'),
          total: daily_sales_total._sum.total || 0
        });
      }

      results.push({
        group_name: group.group_tl[0].name,
        month_sales_total,
        week_sales_total,
        last_30_days_sales_total,
        today_sales_total,
        daily_sales
      });
    }

    const month_sales = results.map((v) => {
      return {
        group_name: v.group_name,
        total: v.month_sales_total._sum.total || 0
      };
    });

    const week_sales = results.map((v) => {
      return {
        group_name: v.group_name,
        total: v.week_sales_total._sum.total || 0
      };
    });

    const last_30_days_sales = results.map((v) => {
      return {
        group_name: v.group_name,
        total: v.last_30_days_sales_total._sum.total
          ? parseFloat((v.last_30_days_sales_total._sum.total / 30).toFixed(1))
          : 0
      };
    });

    const today_sales = results.map((v) => {
      return {
        group_name: v.group_name,
        total: v.today_sales_total._sum.total || 0
      };
    });

    return {
      month_sales,
      week_sales,
      last_30_days_sales,
      today_sales,
      daily_sales_graph: results.map((group) => ({
        group_name: group.group_name,
        daily_sales: group.daily_sales
      }))
    };
  }

  async findDashboardSalesMenus(
    admin: AdminDto,
    time_zone: string
  ): Promise<any> {
    const start_of_today = dayjs().tz(time_zone).startOf('day').toDate();
    const end_of_today = dayjs().tz(time_zone).endOf('day').toDate();

    const start_of_last_30_days = dayjs()
      .tz(time_zone)
      .subtract(29, 'day')
      .startOf('day')
      .toDate();
    const end_of_last_30_days = dayjs().tz(time_zone).endOf('day').toDate();

    const yesterday = dayjs().tz(time_zone).subtract(1, 'day').startOf('day');
    const start_of_last_week_from_yesterday = yesterday
      .subtract(5, 'day')
      .toDate();

    const market = await this.prisma.market.findFirst({
      where: {
        id: admin.market_id
      },
      include: {
        language: true
      }
    });

    const groups = await this.prisma.group.findMany({
      where: {
        market_id: admin.market_id,
        remove_at: null
      },
      include: {
        group_tl: {
          where: {
            language_id: market?.language?.id
          }
        }
      }
    });

    const results: any = [];

    const today_sales_complete_orders = await this.prisma.main_order.aggregate({
      where: {
        status: MainOrderStatus.COMPLETE,
        create_at: {
          gte: start_of_today,
          lt: end_of_today
        },
        remove_at: null
      },
      _count: {
        id: true
      }
    });

    const today_sales_progress_orders = await this.prisma.main_order.aggregate({
      where: {
        status: MainOrderStatus.PROGRESS,
        create_at: {
          gte: start_of_today,
          lt: end_of_today
        },
        remove_at: null
      },
      _count: {
        id: true
      }
    });

    const today_sales_wait_orders = await this.prisma.main_order.aggregate({
      where: {
        status: MainOrderStatus.WAIT,
        create_at: {
          gte: start_of_today,
          lt: end_of_today
        },
        remove_at: null
      },
      _count: {
        id: true
      }
    });

    const today_sales_cancel_orders = await this.prisma.main_order.aggregate({
      where: {
        status: MainOrderStatus.CANCEL,
        create_at: {
          gte: start_of_today,
          lt: end_of_today
        },
        remove_at: null
      },
      _count: {
        id: true
      }
    });

    const last_30_days_complete_orders = await this.prisma.main_order.aggregate(
      {
        where: {
          status: MainOrderStatus.COMPLETE,
          create_at: {
            gte: start_of_last_30_days,
            lt: end_of_last_30_days
          },
          remove_at: null
        },
        _count: {
          id: true
        }
      }
    );

    const last_30_days_cancel_orders = await this.prisma.main_order.aggregate({
      where: {
        status: MainOrderStatus.CANCEL,
        create_at: {
          gte: start_of_last_30_days,
          lt: end_of_last_30_days
        },
        remove_at: null
      },
      _count: {
        id: true
      }
    });

    for (const group of groups) {
      const daily_sales: any = [];

      for (let day = 0; day < 7; day++) {
        const day_start = dayjs(start_of_last_week_from_yesterday)
          .tz(time_zone)
          .add(day, 'day')
          .toDate();
        const day_end = dayjs(day_start).tz(time_zone).endOf('day').toDate();
        const daily_sales_menus = await this.prisma.order_menu.aggregate({
          where: {
            order_group: {
              group_id: group.id
            },
            status: OrderMenuStatus.COMPLETE,
            create_at: {
              gte: day_start,
              lt: day_end
            },
            remove_at: null
          },
          _count: {
            id: true
          }
        });

        daily_sales.push({
          date: dayjs(day_start).format('YYYY-MM-DD'),
          total: daily_sales_menus._count.id || 0
        });
      }

      results.push({
        group_name: group.group_tl[0].name,
        daily_sales
      });
    }

    const last_30_days_sales_avg = {
      complete: last_30_days_complete_orders._count.id
        ? parseFloat((last_30_days_complete_orders._count.id / 30).toFixed(1))
        : 0,
      cancel: last_30_days_cancel_orders._count.id
        ? parseFloat((last_30_days_cancel_orders._count.id / 30).toFixed(1))
        : 0,
      total:
        last_30_days_complete_orders._count.id &&
        last_30_days_cancel_orders._count.id
          ? parseFloat(
              (
                Number(
                  last_30_days_complete_orders._count.id +
                    last_30_days_cancel_orders._count.id
                ) / 30
              ).toFixed(1)
            )
          : 0
    };

    return {
      last_30_days_sales_avg,
      today_sales: {
        total:
          today_sales_complete_orders._count.id ||
          0 + today_sales_progress_orders._count.id ||
          0 + today_sales_wait_orders._count.id ||
          0 + today_sales_cancel_orders._count.id ||
          0,
        complete: today_sales_complete_orders._count.id || 0,
        progress: today_sales_progress_orders._count.id || 0,
        wait: today_sales_wait_orders._count.id || 0,
        cancel: today_sales_cancel_orders._count.id || 0
      },
      daily_sales_graph: results.map((group) => ({
        group_name: group.group_name,
        daily_sales: group.daily_sales
      }))
    };
  }

  async findDashboardSalesRank(
    admin: AdminDto,
    time_zone: string
  ): Promise<any> {
    const start_of_last_30_days = dayjs()
      .tz(time_zone)
      .subtract(29, 'day')
      .startOf('day')
      .toDate();
    const end_of_last_30_days = dayjs().tz(time_zone).endOf('day').toDate();

    // 시장과 언어 정보 조회
    const market = await this.prisma.market.findFirst({
      where: { id: admin.market_id },
      include: { language: true }
    });

    const groups = await this.prisma.group.findMany({
      where: {
        market_id: market?.id,
        remove_at: null
      },
      include: {
        group_tl: {
          where: {
            language_id: market?.language?.id
          }
        }
      }
    });

    const results: any = [];
    for (const group of groups) {
      const aggregation_results = await this.prisma.order_menu.groupBy({
        where: {
          status: OrderMenuStatus.COMPLETE,
          remove_at: null,
          order: {
            remove_at: null,
            main_order: {
              order_group_payment: {
                some: { status: OrderGroupPaymentStatus.PAID }
              },
              remove_at: null,
              market_id: admin.market_id,
              create_at: { gte: start_of_last_30_days, lt: end_of_last_30_days }
            }
          },
          order_group: {
            ...(group.id && { group_id: group.id }),
            group: { remove_at: null }
          },
          menu: { remove_at: null, menu_category: { remove_at: null } }
        },
        by: ['menu_id'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      });

      // 메뉴 정보 조회를 최적화
      const menuDetailsWithQuantity = await Promise.all(
        aggregation_results.map(async (item) => {
          const menu = await this.prisma.menu.findUnique({
            where: { id: item.menu_id },
            select: {
              name: true,
              menu_tl: {
                select: { name: true },
                where: { language_id: market?.language?.id }
              }
            } // 메뉴 이름 선택
          });
          return {
            menu_name: menu?.menu_tl[0].name,
            quantity: item._sum.quantity
          };
        })
      );

      results.push({
        group_name: group.group_tl[0].name,
        sales_rank: menuDetailsWithQuantity // 메뉴 이름과 판매량을 포함
      });
    }

    return results;
  }

  async findById(
    id: number,
    order_menu_status: OrderMenuStatus,
    language_code: string
  ): Promise<any> {
    try {
      const language = await this.prisma.language.findFirst({
        where: {
          code: language_code as Language
        }
      });
      const main_order = await this.findMainOrder(
        id,
        undefined,
        order_menu_status,
        undefined,
        language?.id
      );

      if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);
      return this.partialGroupMap(main_order);
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findByOrderPossibleUser(
    table_id: number,
    user_id: number,
    type: MainOrderTypeEnum
  ): Promise<any> {
    const main_order = await this.prisma.main_order.findFirst({
      where: {
        AND: [
          { table_id },
          { user_id },
          {
            OR: [
              {
                status: MainOrderStatus.WAIT
              },
              {
                status: MainOrderStatus.PROGRESS
              }
            ]
          },
          {
            type
          }
        ]
      },
      include: {
        user: true
      }
    });
    if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);
    return main_order;
  }

  async findByOrderPossibleGuest(
    table_id: number,
    guest_id: string,
    type: MainOrderTypeEnum
  ): Promise<any> {
    const main_order = await this.prisma.main_order.findFirst({
      where: {
        AND: [
          {
            table_id
          },
          {
            guest_id
          },
          {
            OR: [
              {
                status: MainOrderStatus.WAIT
              },
              {
                status: MainOrderStatus.PROGRESS
              }
            ]
          },
          {
            type
          }
        ]
      },
      include: {
        user: true
      }
    });
    if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);
    return main_order;
  }

  async findFirstMainOrderById(id: number): Promise<any> {
    const main_order = await this.prisma.main_order.findFirst({
      where: {
        id
      }
    });
    if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);
    return main_order;
  }

  async findByAdminWithOrderId(
    admin: AdminDto,
    group_ids: string[] | undefined | string,
    main_order_id: number,
    order_menu_status: OrderMenuStatus
  ): Promise<any> {
    const main_order_where: any = {
      market_id: admin.market_id,
      remove_at: null
    };
    const where = {
      id: main_order_id,
      ...main_order_where,
      market: {
        group: {
          some: {
            order_group_payment: {
              some: {
                main_order_id
              }
            }
          }
        }
      }
    };

    const main_order = await this.findMainOrderByAdmin(
      main_order_id,
      where,
      order_menu_status,
      group_ids,
      admin.language_id
    );

    if (!main_order) return [];

    return main_order;
  }

  async findAllByAdmin(
    admin: AdminDto,
    params: FindOrdersAdminParams,
    page_options: PageOptionsDto
  ) {
    const where_conditions = this.createWhereConditionsForAdmin(
      params,
      admin.market_id
    );
    const cursor_conditions = this.pagedCondition(
      where_conditions,
      page_options
    );
    const { skip, take, ...where } = cursor_conditions;
    const [main_orders, item_count] = await Promise.all([
      this.prisma.main_order.findMany({
        where,
        skip,
        take,
        include: this.getCommonInclude(
          params.order_menu_status,
          params.group_ids,
          admin.language_id,
          true
        ),
        orderBy: [{ id: 'desc' }]
      }),
      this.prisma.main_order.count({
        where
      })
    ]);
    return this.performPagedQuery(main_orders, item_count, page_options);
  }

  async findAll(
    user_id: number,
    params: FindOrdersParams,
    page_options: PageOptionsDto
  ) {
    const where_conditions = await this.createWhereConditionsForUser(
      params,
      user_id
    );
    const cursor_conditions = await this.pagedCondition(
      where_conditions,
      page_options
    );
    const { skip, take, ...where } = cursor_conditions;
    const main_orders_filter = await this.prisma.main_order.findMany({
      where,
      skip,
      take,
      include: {
        order: true
      }
    });
    const order_ids = main_orders_filter.flatMap((main_order) =>
      main_order.order.map((order) => order.id)
    );
    cursor_conditions.market.group.some.order_group.some.order_id = {
      in: order_ids
    };
    const language_code = await this.prisma.language.findFirst({
      where: {
        code: params.language_code as Language
      }
    });

    const [main_orders, item_count] = await Promise.all([
      this.prisma.main_order.findMany({
        where,
        skip,
        take,
        orderBy: [{ id: 'desc' }],
        include: this.getCommonIncludeUser(
          params.order_menu_status,
          params.group_ids,
          language_code?.id,
          false
        )
      }),
      this.prisma.main_order.count({
        where
      })
    ]);
    const sanitized_groups = main_orders.map((main_order) =>
      this.partialGroupMap(main_order)
    );
    return this.performPagedQuery(sanitized_groups, item_count, page_options);
  }

  async findByOrderNum(order_num: string): Promise<any> {
    const main_order = await this.prisma.main_order.findUnique({
      where: {
        order_num
      },
      include: this.getCommonIncludeUser(undefined, undefined, undefined, true)
    });
    if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);
    return this.partialGroupMap(main_order);
  }

  async findSales(
    admin: AdminDto,
    params: FindSalesParams,
    page_options: PageOptionsDto
  ): Promise<any> {
    const { group_id, from_date, to_date } = params;
    const cursor_conditions = await this.pagedCondition(
      undefined,
      page_options
    );
    const { skip, take } = cursor_conditions;

    const market = await this.prisma.market.findFirst({
      where: {
        id: admin.market_id
      },
      include: {
        language: true
      }
    });

    const [menu_stats, item_count] = await Promise.all([
      this.prisma.order_menu_stats.findMany({
        where: {
          market_id: admin.market_id,
          ...(group_id && { group_id: Number(group_id) }),
          ...(from_date &&
            to_date && {
              date: {
                gte: dayjs(from_date).toDate(),
                lte: dayjs(to_date).toDate()
              }
            })
        },
        select: {
          id: true,
          group_id: true,
          total: true,
          quantity: true,
          update_at: true,
          group: {
            select: {
              group_tl: {
                select: {
                  name: true
                },
                where: {
                  language_id: market?.language?.id
                }
              }
            }
          }
        },
        skip,
        take,
        orderBy: {
          date: 'desc',
          group_id: 'desc'
        }
      }),
      this.prisma.order_menu_stats.count({
        where: {
          market_id: admin.market_id,
          ...(group_id && { group_id: Number(group_id) }),
          ...(from_date &&
            to_date && {
              date: {
                gte: dayjs(from_date).toDate(),
                lte: dayjs(to_date).toDate()
              }
            })
        }
      })
    ]);
    return this.performPagedQuery(menu_stats, item_count, page_options);
  }

  async findProducts(
    admin: AdminDto,
    order_menu_stats_id: number,
    group_id: string
  ): Promise<any> {
    const market = await this.prisma.market.findFirst({
      where: {
        id: admin.market_id
      },
      include: {
        language: true
      }
    });
    const order_menu_stats = await this.prisma.order_menu_stats.findFirst({
      where: {
        id: order_menu_stats_id
      }
    });
    // 상위 판매 메뉴와 주문 금액 합계를 한 번의 쿼리로 집계
    const aggregation_results = await this.prisma.order_menu.groupBy({
      where: {
        order_group: {
          ...(group_id && { group_id: Number(group_id) })
        },
        remove_at: null,
        status: OrderMenuStatus.COMPLETE,
        order_menu_stats: {
          id: order_menu_stats?.id
        }
      },
      by: ['menu_id'],
      _sum: { sum: true, quantity: true },
      orderBy: { _count: { menu_id: 'desc' } }
    });

    // 메뉴 정보 조회를 최적화
    const sorted_aggregation_results = aggregation_results.sort(
      (a, b) => (b._sum.sum ?? 0) - (a._sum.sum ?? 0)
    );
    const menu_ids = sorted_aggregation_results.map((result) => result.menu_id);
    const menus = await this.prisma.menu.findMany({
      where: { id: { in: menu_ids } },
      include: {
        menu_tl: { where: { language_id: market?.language?.id } },
        menu_category: {
          include: {
            group: {
              include: {
                group_tl: { where: { language_id: market?.language?.id } }
              }
            }
          }
        }
      }
    });

    // 결과 데이터 매핑
    const menu_rank_data = aggregation_results.map((item) => {
      const menu: any = menus.find((menu) => menu.id === item.menu_id) || {};
      return {
        name: menu.menu_tl?.[0]?.name || 'Unknown Menu',
        group_name: menu.menu_category?.group?.group_tl?.[0]?.name || '',
        count: item._sum.quantity,
        total: item._sum.sum || 0
      };
    });
    return menu_rank_data;
  }

  private partialGroupMap(main_order: any) {
    return {
      id: main_order.id,
      market_id: main_order.market_id,
      market: (() => {
        const market_copy = { ...main_order.market };
        delete market_copy.group;
        return market_copy;
      })(),
      user_id: main_order.user_id,
      guest_id: main_order.guest_id,
      table: main_order.table,
      delivery_addr: main_order.delivery_addr,
      type: main_order.type,
      order_num: main_order.order_num,
      status: main_order.status,
      total: main_order.total,
      currency_code: main_order.currency_code,
      phone: main_order.phone,
      create_at: main_order.create_at,
      update_at: main_order.update_at,
      user: (() => {
        const user_copy = { ...main_order.user };
        delete user_copy.password;
        return user_copy;
      })(),
      groups: main_order.market.group.map(
        (grp: { order_group_payment: any[]; order_group: any[] }) => {
          const matched_order_group_payments = grp.order_group_payment.filter(
            (ogp) => ogp.main_order_id === main_order.id
          );
          const matched_order_groups = grp.order_group.filter(
            (og: { main_order_id: number; order_menu: any[] }) =>
              og.main_order_id === main_order.id && og.order_menu.length >= 1
          );
          return {
            ...grp,
            order_group_payment: matched_order_group_payments,
            order_group: matched_order_groups
          };
        }
      )
    };
  }

  private async findMainOrder(
    id: number,
    additional_where: any = {},
    order_menu_status: OrderMenuStatus,
    group_ids?: string | string[],
    language_id?: number
  ) {
    const main_order = await this.prisma.main_order.findUnique({
      where: { id, ...additional_where },
      include: this.getCommonIncludeUser(
        order_menu_status,
        group_ids,
        language_id,
        true
      )
    });
    return main_order;
  }

  private async findMainOrderByAdmin(
    id: number,
    additional_where: any = {},
    order_menu_status: OrderMenuStatus,
    group_ids?: string | string[],
    language_id?: number
  ) {
    const main_order = await this.prisma.main_order.findUnique({
      where: { id, ...additional_where },
      include: this.getCommonInclude(
        order_menu_status,
        group_ids,
        language_id,
        true
      )
    });
    return main_order;
  }

  async validateOrder(additional_where: any = {}) {
    const main_order = await this.prisma.main_order.findFirst({
      where: additional_where
    });
    return main_order;
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

  private createWhereConditionsForAdmin(
    params: FindOrdersAdminParams,
    market_id: number
  ) {
    const {
      order_num,
      menu_name,
      user_type,
      types,
      status,
      table_id,
      order_group_payment_status,
      from_date,
      to_date,
      group_ids
    } = params;
    const where: any = {
      ...(order_num && {
        OR: [
          { order_num: { startsWith: order_num } },
          { order_num: { endsWith: order_num } }
        ]
      }),
      market_id: market_id,
      remove_at: null,
      ...(order_num && {
        OR: [
          { order_num: { startsWith: order_num } },
          { order_num: { endsWith: order_num } }
        ]
      }),
      ...(types && { type: { in: types as MainOrderTypeEnum[] } }),
      ...(status && {
        status: { in: status as MainOrderStatus[] }
      }),
      ...(table_id && { table_id: Number(table_id) }),
      order_group_payment: {
        some: {
          ...(group_ids && {
            group_id: Array.isArray(group_ids)
              ? { in: group_ids.map(Number) }
              : group_ids
          }),
          ...(order_group_payment_status && {
            status: order_group_payment_status
          }),
          order_group: {
            some: {
              ...(group_ids && {
                group_id: Array.isArray(group_ids)
                  ? { in: group_ids.map(Number) }
                  : group_ids
              }),
              order_menu: {
                some: {
                  ...(menu_name && {
                    menu: {
                      OR: [
                        { name: { startsWith: menu_name } },
                        { name: { endsWith: menu_name } }
                      ]
                    }
                  })
                }
              }
            }
          }
        }
      },
      ...this.createDateFilter(from_date, to_date)
    };
    if (user_type) {
      if (user_type === UserTypeEnum.GUEST) where.user_id = null;
      else where.guest_id = null;
    }
    return where;
  }

  private async createWhereConditionsForUser(
    params: FindOrdersParams,
    user_id: number
  ) {
    const {
      market_id,
      order_num,
      menu_name,
      user_type,
      guest_id,
      types,
      order_menu_status,
      status,
      table_id,
      order_group_payment_status,
      from_date,
      to_date
    } = params;

    const order_group_payment_where: any = {
      ...(order_group_payment_status && { status: order_group_payment_status })
    };

    const where: any = {
      ...(order_num && {
        OR: [
          { order_num: { startsWith: order_num } },
          { order_num: { endsWith: order_num } }
        ]
      }),
      ...(user_id && { user_id }),
      ...(guest_id && { guest_id }),
      ...(types && { type: { in: types as MainOrderTypeEnum[] } }),
      ...(status && {
        status: { in: status as MainOrderStatus[] }
      }),
      ...(table_id && { table_id: Number(table_id) }),
      market: {
        group: {
          some: {
            market_id: Number(market_id),
            remove_at: null,
            order_group_payment: {
              some: {
                ...order_group_payment_where
              }
            },
            order_group: {
              some: {
                // order: {
                //   remove_at: null,
                order_menu: {
                  some: {
                    ...(order_menu_status && { status: order_menu_status }),
                    ...(menu_name && {
                      menu: {
                        OR: [
                          { name: { startsWith: menu_name } },
                          { name: { endsWith: menu_name } }
                        ]
                      }
                    })
                  }
                }
                // }
              }
            }
          }
        }
      },
      ...this.createDateFilter(from_date, to_date)
    };

    if (user_type) {
      if (user_type === UserTypeEnum.GUEST) where.user_id = null;
      else where.guest_id = null;
    }
    return where;
  }

  private createDateFilter(from_date: string, to_date: string) {
    if (from_date || to_date) {
      return {
        create_at: {
          ...(from_date && { gte: dayjs(from_date).toDate() }),
          ...(to_date && { lte: dayjs(to_date).toDate() })
        }
      };
    }
    return {};
  }

  private getCommonInclude(
    order_menu_status?: OrderMenuStatus,
    order_group_ids?: string | string[],
    language_id?: number,
    option_flag?: boolean
  ) {
    // 기본 JSON 구조를 생성하는 함수
    const createIncludeStructure = () => ({
      table: {
        include: {
          group: {
            include: {
              group_tl: {
                where: {}
              }
            }
          }
        }
      },
      user: true,
      order_group_payment: {
        include: {
          order_group: {
            include: {
              group: {
                include: {
                  group_tl: { where: {} }
                }
              },
              order_menu: {
                include: {
                  menu: {
                    include: {
                      menu_tl: { where: {} }
                    }
                  },
                  order_menu_option: {
                    include: {
                      menu_option: {
                        include: {
                          menu_option_tl: { where: {} },
                          menu_option_category: {
                            include: {
                              menu_option_category_tl: { where: {} }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                orderBy: [{ id: 'desc' }]
              }
            },
            orderBy: [{ id: 'desc' }]
          }
        }
      }
    });

    const include: any = createIncludeStructure();

    if (!option_flag) {
      delete include.order_group_payment.include.order_group.include.order_menu
        .include.order_menu_option;
    }

    if (order_menu_status) {
      include.order_group_payment.include.order_group.include.order_menu.where =
        {
          status: { not: order_menu_status }
        };
    }

    if (order_group_ids) {
      include.order_group_payment.include.order_group.where = {
        group_id: {
          in: Array.isArray(order_group_ids)
            ? order_group_ids.map(Number)
            : [Number(order_group_ids)]
        }
      };
    }

    if (language_id) {
      const setLanguageId = (path: { where: { language_id: number } }) => {
        path.where.language_id = language_id;
      };

      setLanguageId(
        include.order_group_payment.include.order_group.include.group.include
          .group_tl
      );
      setLanguageId(
        include.order_group_payment.include.order_group.include.order_menu
          .include.menu.include.menu_tl
      );
      setLanguageId(include.table.include.group.include.group_tl);

      if (option_flag) {
        setLanguageId(
          include.order_group_payment.include.order_group.include.order_menu
            .include.order_menu_option.include.menu_option.include
            .menu_option_tl
        );
        setLanguageId(
          include.order_group_payment.include.order_group.include.order_menu
            .include.order_menu_option.include.menu_option.include
            .menu_option_category.include.menu_option_category_tl
        );
      }
    }
    return include;
  }

  private getCommonIncludeUser(
    order_menu_status?: OrderMenuStatus,
    order_group_ids?: string | string[],
    language_id?: number,
    option_flag?: boolean
  ) {
    // 기본 JSON 구조를 생성하는 함수
    const createIncludeStructure = () => ({
      table: {
        include: {
          group: {
            include: {
              group_tl: { where: {} }
            }
          }
        }
      },
      user: true,
      market: {
        include: {
          group: {
            where: { remove_at: null },
            include: {
              setting: {
                include: {
                  logo: true
                }
              },
              order_group_payment: true,
              group_tl: { where: {} },
              order_group: {
                include: {
                  order_menu: {
                    include: {
                      menu: {
                        include: {
                          menu_tl: { where: {} }
                        }
                      },
                      order_menu_option: {
                        include: {
                          menu_option: {
                            include: {
                              menu_option_tl: { where: {} },
                              menu_option_category: {
                                include: {
                                  menu_option_category_tl: { where: {} }
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    orderBy: [{ id: 'asc' }]
                  }
                },
                orderBy: [{ id: 'asc' }]
              }
            }
          }
        }
      }
    });

    const include: any = createIncludeStructure();

    if (!option_flag) {
      delete include.market.include.group.include.order_group.include.order_menu
        .include.order_menu_option;
    }

    if (order_menu_status) {
      include.market.include.group.include.order_group.include.order_menu.where =
        {
          status: { not: order_menu_status }
        };
    }

    if (order_group_ids) {
      include.market.include.group.include.order_group.where = {
        group_id: {
          in: Array.isArray(order_group_ids)
            ? order_group_ids.map(Number)
            : [Number(order_group_ids)]
        }
      };
    }

    if (language_id) {
      const setLanguageId = (path: { where: { language_id: number } }) => {
        path.where.language_id = language_id;
      };

      setLanguageId(include.market.include.group.include.group_tl);
      setLanguageId(
        include.market.include.group.include.order_group.include.order_menu
          .include.menu.include.menu_tl
      );
      setLanguageId(include.table.include.group.include.group_tl);

      if (option_flag) {
        setLanguageId(
          include.market.include.group.include.order_group.include.order_menu
            .include.order_menu_option.include.menu_option.include
            .menu_option_tl
        );
        setLanguageId(
          include.market.include.group.include.order_group.include.order_menu
            .include.order_menu_option.include.menu_option.include
            .menu_option_category.include.menu_option_category_tl
        );
      }
    }
    return include;
  }
}
