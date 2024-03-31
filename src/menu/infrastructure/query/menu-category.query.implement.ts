import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import CustomError from 'src/common/error/custom-error';
import { GroupEntity } from 'src/group/infrastructure/entity/group.entity';
import { MenuCategoryQuery } from 'src/menu/application/query/menu-category.query';
import { MenuCategoryEntity } from '../entity/menu-category.entity';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class MenuCategoryQueryImplement implements MenuCategoryQuery {
  private readonly logger = new Logger(MenuCategoryQueryImplement.name);
  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findAll(market_id: number): Promise<MenuCategoryEntity[] | null> {
    try {
      const market = await this.prisma.market.findFirst({
        where: {
          id: market_id
        },
        include: {
          language: true
        }
      });
      const entities = (await this.prisma.group.findMany({
        where: {
          market_id,
          remove_at: null
        },
        include: {
          group_tl: {
            select: {
              id: true,
              name: true
            },
            where: {
              language_id: market?.language?.id
            }
          },
          menu_category: {
            where: {
              remove_at: null
            },
            orderBy: {
              index: 'asc'
            },
            select: {
              id: true,
              menu_category_tl: {
                select: {
                  id: true,
                  name: true
                },
                where: {
                  language_id: market?.language?.id
                }
              }
            }
          }
        },
        orderBy: {
          create_at: 'asc'
        }
      })) as GroupEntity[] as MenuCategoryEntity[];
      return entities ? entities : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findById(
    admin: AdminDto,
    id: number
  ): Promise<MenuCategoryEntity | null> {
    try {
      const market = await this.prisma.market.findFirst({
        where: {
          id: admin.market_id
        },
        include: {
          language: true
        }
      });
      const entity = (await this.prisma.menu_category.findUnique({
        where: {
          id,
          remove_at: null
        },
        include: {
          menu_category_tl: {
            select: {
              id: true,
              name: true
            },
            where: {
              language_id: market?.language?.id
            }
          },
          group: {
            select: {
              id: true,
              group_tl: {
                select: {
                  id: true,
                  name: true
                },
                where: {
                  language_id: market?.language?.id
                }
              }
            }
          }
        }
      })) as MenuCategoryEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
}
