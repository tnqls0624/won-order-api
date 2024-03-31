import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { MarketEntity } from '../entity/market.entity';
import { Market, MarketProperties } from 'src/auth/domain/market';
import { MarketFactory } from 'src/auth/domain/market.factory';
import { MarketRepository } from 'src/auth/domain/market.repository';
import { UpdateMarketDto } from 'src/auth/interface/dto/req/update-market.dto';
import dayjs from 'dayjs';

export class MarketRepositoryImplement implements MarketRepository {
  private readonly logger = new Logger(MarketRepositoryImplement.name);

  constructor(
    @Inject(InjectionToken.MARKET_FACTORY)
    private readonly marketFactory: MarketFactory,
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async delete(id: number): Promise<boolean> {
    await this.prisma.market.update({
      where: {
        id
      },
      data: {
        remove_at: dayjs().toDate()
      }
    });
    return true;
  }

  async findById(id: number): Promise<Market | null> {
    const entity = (await this.prisma.market.findFirst({
      where: {
        id
      }
    })) as MarketEntity;
    return this.entityToModel(entity) || null;
  }

  async update(id: number, body: UpdateMarketDto): Promise<boolean> {
    await this.prisma.market.update({
      where: {
        id
      },
      data: body as any
    });
    return true;
  }

  async save(market: Market): Promise<MarketEntity | null> {
    const entitie = this.modelToEntity(market);
    const entity = await this.prisma.market.create({
      data: entitie
    });
    return entity;
  }

  private modelToEntity(model: Market): MarketEntity {
    const properties = JSON.parse(JSON.stringify(model)) as MarketProperties;
    return {
      ...properties,
      create_at: properties.create_at,
      remove_at: properties.remove_at
    };
  }

  private entityToModel(entity: MarketEntity): Market {
    return this.marketFactory.reconstitute({
      ...entity,
      create_at: entity.create_at,
      remove_at: entity.remove_at
    });
  }
}
