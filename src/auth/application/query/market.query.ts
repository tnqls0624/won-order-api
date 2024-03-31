import { MarketEntity } from 'src/auth/infrastructure/entity/market.entity';

export interface MarketQuery {
  findAll: () => Promise<MarketEntity[]>;
  findByName: (name: string) => Promise<MarketEntity | null>;
  findByAccessId: (access_id: string) => Promise<MarketEntity | null>;
}
