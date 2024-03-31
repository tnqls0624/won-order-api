import { Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SettingQuery } from 'src/setting/application/query/setting.query';
import { SettingEntity } from '../entity/setting.entity';

export class SettingQueryImplement implements SettingQuery {
  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findById(id: number): Promise<SettingEntity[] | null> {
    const entities = (await this.prisma.setting.findMany({
      where: {
        market_id: id,
        remove_at: null
      },
      include: {
        logo: {
          select: {
            w120: true,
            w360: true
          }
        },
        group: {
          include: {
            group_tl: true
          }
        },
        market: {
          include: {
            language: true,
            currency: true
          }
        }
      }
    })) as SettingEntity[];
    return entities ? entities : null;
  }

  async findByGroupId(id: number): Promise<SettingEntity | null> {
    const entitiy = (await this.prisma.setting.findUnique({
      where: {
        group_id: id,
        remove_at: null
      },
      include: {
        logo: {
          select: {
            w120: true,
            w360: true
          }
        },
        market: {
          include: {
            language: true,
            currency: true
          }
        }
      }
    })) as SettingEntity;
    return entitiy ? entitiy : null;
  }
}
