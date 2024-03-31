import { Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MarketQuery } from 'src/auth/application/query/market.query';
import { MarketEntity } from '../entity/market.entity';

export class MarketQueryImplement implements MarketQuery {
  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findAll(): Promise<MarketEntity[]> {
    const entities = (await this.prisma.market.findMany({
      where: {
        remove_at: null
      }
    })) as MarketEntity[];
    return entities;
  }

  async findById(id: number): Promise<MarketEntity | null> {
    const entity = (await this.prisma.market.findFirst({
      where: {
        id,
        remove_at: null
      }
    })) as MarketEntity;
    return entity ? entity : null;
  }

  async findByName(name: string): Promise<MarketEntity | null> {
    const entity = (await this.prisma.market.findFirst({
      where: {
        name,
        remove_at: null
      }
    })) as MarketEntity;
    return entity ? entity : null;
  }

  async findByAccessId(access_id: string): Promise<MarketEntity | null> {
    const entity = (await this.prisma.market.findFirst({
      where: {
        access_id,
        remove_at: null
      }
    })) as MarketEntity;
    return entity ? entity : null;
  }
}
