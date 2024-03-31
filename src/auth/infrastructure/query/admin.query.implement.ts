import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AdminQuery } from 'src/auth/application/query/admin.query';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { AdminType } from 'src/types/login.type';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/utils/paginate/dto';
import { AdminEntity } from '../entity/admin.entity';
import { MarketEntity } from '../entity/market.entity';
import { MainOrderStatus } from 'src/order/infrastructure/entity/main-order.entity';

interface AdminWhereCondition {
  market_id: number;
  type: AdminType;
  remove_at: null;
  nickname?: {
    startsWith: string;
  };
  admin_id?: {
    startsWith: string;
  };
  admin_group?: {
    some: object;
  };
}

export class AdminQueryImplement implements AdminQuery {
  private readonly logger = new Logger(AdminQueryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async duplicatedAdminCheck(type: AdminType, market_id: number): Promise<any> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        type,
        market_id,
        remove_at: null
      }
    });
    return admin;
  }

  async duplicatedIdCheck(type: AdminType, admin_id: string): Promise<any> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        type,
        admin_id,
        remove_at: null
      }
    });
    return admin;
  }

  async findAlreadyOrder(market_id: number) {
    const main_order = await this.prisma.main_order.findFirst({
      where: {
        market_id,
        status: {
          in: [MainOrderStatus.WAIT, MainOrderStatus.PROGRESS]
        }
      }
    });
    return main_order;
  }

  async findAllByType(
    market_id: number,
    group_id: number,
    type: AdminType
  ): Promise<{ id: number; language_id: number }[]> {
    const entities = await this.prisma.admin.findMany({
      where: {
        market_id,
        type,
        remove_at: null,
        admin_group: {
          some: {
            group_id: group_id,
            selected: true
          }
        }
      },
      include: {
        language: true
      }
    });
    return entities.map((entity) => ({
      id: entity.id,
      language_id: entity.language_id
    }));
  }

  async findAll(
    admin: AdminDto,
    group_id: number,
    admin_id: string,
    nickname: string,
    page_query: PageOptionsDto
  ) {
    try {
      const { page, limit } = page_query;
      const admin_where: AdminWhereCondition = {
        market_id: admin.market_id,
        type: AdminType.EMPLOYEE,
        remove_at: null
      };
      if (nickname)
        admin_where.nickname = {
          startsWith: nickname
        };

      if (admin_id) {
        admin_where.admin_id = {
          startsWith: admin_id
        };
      }
      if (group_id) {
        admin_where.admin_group = {
          some: {
            group_id: Number(group_id),
            selected: true
          }
        };
      }

      const language = await this.prisma.language.findFirst({
        where: {
          market: {
            some: {
              id: admin.market_id
            }
          }
        }
      });

      const admins: any = await this.prisma.admin.findMany({
        where: admin_where,
        include: {
          language: true,
          admin_group: true
        },
        orderBy: {
          id: 'desc'
        },
        take: limit,
        skip: (page - 1) * limit
      });
      const groups = await this.prisma.group.findMany({
        where: {
          market_id: admin.market_id,
          remove_at: null
        },
        include: {
          group_tl: {
            select: {
              id: true,
              name: true
            },
            where: {
              language_id: language?.id
            }
          }
        }
      });
      for (const admin of admins) {
        const admin_group = new Map<number, boolean>();
        if (admin.admin_group) {
          for (const ag of admin.admin_group) {
            admin_group.set(ag.group_id, ag.selected);
          }
        }
        admin.admin_group = groups.map((group: any) => ({
          group_id: group.id,
          selected: admin_group.get(group.id) ?? false,
          name: group.group_tl[0].name
        }));
      }
      const count = await this.prisma.admin.count({
        where: admin_where
      });
      const pageMetaDto: PageMetaDto = new PageMetaDto({
        itemCount: count,
        pageOptionsDto: { page, limit }
      });
      return new PageDto(admins, pageMetaDto);
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findMarketById(id: number): Promise<MarketEntity | null> {
    try {
      const entity = await this.prisma.market.findUnique({
        where: {
          id,
          remove_at: null
        },
        include: {
          currency: true
        }
      });
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async checkDuplicateById(
    market_id: number,
    admin_id: string
  ): Promise<boolean> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        market_id,
        admin_id,
        remove_at: null
      }
    });
    if (admin) return false;
    return true;
  }

  async findById(id: number): Promise<AdminEntity | null> {
    const entity = (await this.prisma.admin.findFirst({
      where: {
        id,
        remove_at: null
      },
      include: {
        language: true
      }
    })) as AdminEntity;
    return entity ? entity : null;
  }

  async findAllAdmin(): Promise<AdminEntity[]> {
    const entities = (await this.prisma.admin.findMany({
      where: {
        type: AdminType.MASTER,
        remove_at: null
      },
      include: {
        language: true
      }
    })) as AdminEntity[];
    return entities;
  }

  async login(type: AdminType, access_id: string, admin_id: string) {
    switch (type) {
      case AdminType.MASTER:
      case AdminType.SUPER: {
        const admin = (await this.prisma.admin.findFirst({
          where: {
            type,
            admin_id,
            remove_at: null
          },
          include: {
            language: true
          }
        })) as AdminEntity;
        return admin;
      }
      case AdminType.EMPLOYEE: {
        const market = await this.prisma.market.findUnique({
          where: {
            access_id,
            remove_at: null
          }
        });
        if (!market) throw new CustomError(RESULT_CODE.NOT_FOUND_MARKET);
        const admin = (await this.prisma.admin.findFirst({
          where: {
            type,
            admin_id,
            market_id: market.id,
            remove_at: null
          },
          include: {
            language: true
          }
        })) as AdminEntity;
        return admin;
      }
      default:
        throw new CustomError(RESULT_CODE.UNKNOWN_ERROR);
    }
  }
}
