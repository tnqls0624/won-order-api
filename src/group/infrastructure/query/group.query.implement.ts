import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import CustomError from 'src/common/error/custom-error';
import { GroupQuery } from 'src/group/application/query/group.query';
import { GroupEntity } from '../entity/group.entity';

export class GroupQueryImplement implements GroupQuery {
  private readonly logger = new Logger(GroupQueryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findGroupTl(id: number): Promise<any> {
    const language = await this.prisma.language.findMany({
      include: {
        group_tl: {
          where: {
            group_id: id
          }
        }
      }
    });
    return language;
  }

  async findByIdIncludeGroupTl(
    id: number,
    language_id: number
  ): Promise<any | null> {
    try {
      const entity = await this.prisma.group.findFirst({
        where: {
          id,
          remove_at: null
        },
        include: {
          setting: true,
          group_tl: {
            select: {
              id: true,
              name: true
            },
            where: {
              language_id
            }
          }
        }
      });
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findAll(market_id: number): Promise<GroupEntity[] | null> {
    try {
      const entities = (await this.prisma.group.findMany({
        where: {
          market_id,
          remove_at: null
        },
        include: {
          group_tl: {
            select: {
              id: true,
              name: true,
              language: {
                select: {
                  code: true
                }
              }
            }
          }
        }
      })) as GroupEntity[];
      return entities ? entities : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findById(id: number): Promise<GroupEntity | null> {
    try {
      const entity = (await this.prisma.group.findFirst({
        where: {
          id,
          remove_at: null
        },
        include: {
          setting: true,
          group_tl: {
            select: {
              id: true,
              name: true,
              language: {
                select: {
                  id: true,
                  code: true
                }
              }
            }
          }
        }
      })) as GroupEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findByIdWithLanguageId(
    id: number,
    language_id: number
  ): Promise<GroupEntity | null> {
    try {
      const entity = (await this.prisma.group.findFirst({
        where: {
          id,
          remove_at: null
        },
        include: {
          setting: true,
          group_tl: {
            select: {
              id: true,
              language_id: true,
              name: true
            },
            where: {
              language_id
            }
          }
        }
      })) as GroupEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
}
