import { MarketEntity } from '../infrastructure/entity/market.entity';
import { UpdateMarketDto } from '../interface/dto/req/update-market.dto';
import { Market } from './market';

export interface MarketRepository {
  delete: (id: number) => Promise<boolean>;
  save: (market: Market) => Promise<MarketEntity | null>;
  findById: (id: number) => Promise<Market | null>;
  update: (id: number, body: UpdateMarketDto) => Promise<boolean>;
}
