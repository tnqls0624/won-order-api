import { Inject, Logger } from '@nestjs/common';
import { $Enums, Prisma, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { Admin, AdminProperties } from 'src/auth/domain/admin';
import { AdminFactory } from 'src/auth/domain/admin.factory';
import { AdminRepository } from 'src/auth/domain/admin.repository';
import CustomError from 'src/common/error/custom-error';
import { AdminEntity } from '../entity/admin.entity';
import { InjectionToken } from 'src/auth/application/Injection-token';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { MainOrderStatus } from 'src/order/infrastructure/entity/main-order.entity';
import { OrderGroupPaymentStatus } from 'src/order/infrastructure/entity/order-group-payment.entity';
import { OrderMenuStatus } from 'src/order/infrastructure/entity/order-menu.entity';
import { UpdateEmployeeDto } from 'src/auth/interface/dto/req/update-employee.dto';
import { AdminType, LoginType } from 'src/types/login.type';
import { UpdateMasterDto } from 'src/auth/interface/dto/req/update-master.dto';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export class AdminRepositoryImplement implements AdminRepository {
  private readonly logger = new Logger(AdminRepositoryImplement.name);

  constructor(
    @Inject(InjectionToken.ADMIN_FACTORY)
    private readonly adminFactory: AdminFactory,
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async updateAllOrderStatus(
    market_id: number,
    group_id: string,
    status: MainOrderStatus
  ) {
    await this.prisma.main_order.updateMany({
      where: {
        market_id,
        ...(group_id && {
          order_group: { some: { group_id: Number(group_id) } }
        }),
        status: {
          in: [MainOrderStatus.WAIT, MainOrderStatus.PROGRESS]
        },
        remove_at: null
      },
      data: {
        status
      }
    });

    await this.prisma.order_menu.updateMany({
      where: {
        order_group: {
          main_order: {
            status: {
              in: [MainOrderStatus.WAIT, MainOrderStatus.PROGRESS]
            }
          }
        },
        ...(group_id && {
          order_group: { group_id: Number(group_id) }
        }),
        remove_at: null
      },
      data: {
        status
      }
    });

    await this.prisma.order_group_payment.updateMany({
      where: {
        order_group: {
          some: {
            ...(group_id && {
              group_id: Number(group_id)
            }),
            main_order: {
              status: {
                in: [MainOrderStatus.WAIT, MainOrderStatus.PROGRESS]
              }
            }
          }
        },
        remove_at: null
      },
      data: {
        status: OrderGroupPaymentStatus.NOT_PAID
      }
    });

    return true;
  }

  async createSaleStats(
    market_id: number,
    group_id: string,
    geo: string
  ): Promise<any> {
    const groups = await this.prisma.group.findMany({
      where: {
        ...(group_id && {
          id: Number(group_id)
        }),
        market_id,
        setting: {
          remove_at: null
        },
        remove_at: null
      },
      include: { setting: true }
    });

    for (const group of groups) {
      this.logger.log(`Group Name : ${group.name}`);
      let end_business_hours = dayjs().tz(geo);
      const start_business_hours = dayjs(
        group?.setting?.start_business_hours ?? '00:00:00',
        'HH:mm:ss'
      ).tz(geo, true);
      let cal_date = dayjs(
        group?.setting?.end_business_hours ?? '00:00:00',
        'HH:mm:ss'
      ).tz(geo, true);

      // 영업 종료 시간이 시작 시간보다 앞설 경우, 종료 시간을 다음 날로 설정
      if (
        end_business_hours.isBefore(start_business_hours) ||
        end_business_hours.isSame(start_business_hours)
      ) {
        cal_date = dayjs(
          group?.setting?.end_business_hours ?? '00:00:00',
          'HH:mm:ss'
        )
          .tz(geo, true)
          .add(1, 'day');
        end_business_hours = dayjs(end_business_hours).add(1, 'day');
      }

      let stats = await this.prisma.order_menu_stats.findFirst({
        where: {
          group_id: group.id,
          date: dayjs(cal_date.format('YYYY-MM-DD HH:mm:ss')).toDate()
        }
      });

      // 정산 데이터 생성 로직
      const order_stats = await this.prisma.order_group_payment.aggregate({
        where: {
          order_group: {
            some: {
              order_menu: {
                some: {
                  status: OrderMenuStatus.COMPLETE
                }
              }
            }
          },
          group_id: group.id,
          status: OrderGroupPaymentStatus.PAID,
          remove_at: null,
          create_at: {
            gte: start_business_hours.toDate(),
            lte: end_business_hours.toDate()
          }
        },
        _sum: {
          total: true
        },
        _count: {
          id: true
        }
      });

      this.logger.log(
        `매출 집계 시작! : ${group.name}, 매출량 : ${
          order_stats._count.id ?? 0
        } 건, 금액 : ${order_stats._sum.total ?? 0}`
      );

      if (!stats) {
        stats = await this.prisma.order_menu_stats.create({
          data: {
            group_id: group.id,
            date: dayjs(cal_date.format('YYYY-MM-DD HH:mm:ss')).toDate(),
            quantity: order_stats._count.id ?? 0,
            total: order_stats._sum.total ?? 0
          }
        });
      } else {
        stats = await this.prisma.order_menu_stats.update({
          where: {
            id: stats.id
          },
          data: {
            group_id: group.id,
            date: dayjs(cal_date.format('YYYY-MM-DD HH:mm:ss')).toDate(),
            quantity: order_stats._count.id ?? 0,
            total: order_stats._sum.total ?? 0
          }
        });
      }

      await this.prisma.order_menu.updateMany({
        where: {
          order_group: {
            group_id: group.id,
            order_group_payment: {
              status: OrderGroupPaymentStatus.PAID,
              remove_at: null,
              create_at: {
                gte: start_business_hours.toDate(),
                lte: end_business_hours.toDate()
              }
            }
          },
          remove_at: null
        },
        data: {
          order_menu_stats_id: stats.id
        }
      });

      this.logger.log(
        `Order stats saved for group ID ${group.id} in market ID ${market_id}.`
      );
    }
  }

  async save(admin: Admin): Promise<AdminEntity | null> {
    try {
      const entitie = this.modelToEntity(admin);
      const data: any = {
        ...entitie
      };
      const entity = (await this.prisma.admin.create({
        data
      })) as unknown as AdminEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findById(id: number): Promise<Admin | null> {
    const entity = (await this.prisma.admin.findFirst({
      where: {
        id
      }
    })) as AdminEntity;
    return entity ? this.entityToModel(entity) : null;
  }

  async updatePassword(id: number, password: string) {
    const entity = (await this.prisma.admin.update({
      where: {
        id
      },
      data: {
        password
      }
    })) as unknown as AdminEntity;
    return entity ? this.entityToModel(entity) : null;
  }

  async update(id: number, body: UpdateEmployeeDto) {
    const { nickname, language } = body;
    const data: Prisma.adminUncheckedUpdateInput = {};
    if (nickname) data.nickname = nickname;
    if (language) {
      const language = await this.prisma.language.findFirst({
        where: {
          code: body.language
        }
      });
      data.language_id = language?.id;
    }
    await this.prisma.admin.update({
      where: {
        id
      },
      data
    });
    return true;
  }

  async findByMasterId(type: AdminType, id: number): Promise<Admin | null> {
    const entity = (await this.prisma.admin.findFirst({
      where: {
        id,
        type,
        remove_at: null
      }
    })) as AdminEntity;
    return entity ? this.entityToModel(entity) : null;
  }

  async updateMaster(id: number, body: UpdateMasterDto) {
    await this.prisma.admin.update({
      where: {
        id
      },
      data: body
    });
    return true;
  }

  async delete(id: number): Promise<Admin | null> {
    const entity = (await this.prisma.admin.update({
      where: { id },
      data: {
        remove_at: dayjs().toDate()
      }
    })) as AdminEntity;
    return entity ? this.entityToModel(entity) : null;
  }

  async validateAdmin(
    type: LoginType,
    market_id: number | undefined,
    admin_id: string
  ): Promise<unknown | null> {
    const admin = await this.prisma.admin.findFirst({
      select: {
        id: true,
        market_id: true,
        admin_id: true,
        type: true,
        language_id: true,
        language: true,
        nickname: true,
        create_at: true,
        update_at: true,
        admin_group: {
          select: {
            selected: true,
            group: {
              select: {
                id: true,
                name: true,
                content: true,
                group_tl: true
              }
            }
          }
        }
      },
      where: {
        ...(market_id && { market_id }),
        type: type as $Enums.AdminType,
        admin_id,
        remove_at: null
      }
    });

    return admin;
  }

  async findMarket(id: number) {
    const market = await this.prisma.market.findUnique({
      where: {
        id
      },
      include: {
        currency: true
      }
    });
    return market;
  }

  private modelToEntity(model: Admin): AdminEntity {
    const properties = JSON.parse(JSON.stringify(model)) as AdminProperties;
    return {
      ...properties,
      create_at: properties.create_at,
      remove_at: properties.remove_at
    };
  }

  private entityToModel(entity: AdminEntity): Admin {
    return this.adminFactory.reconstitute({
      ...entity,
      create_at: entity.create_at,
      remove_at: entity.remove_at
    });
  }
}
