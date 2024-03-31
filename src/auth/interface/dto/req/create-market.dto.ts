import { PickType } from '@nestjs/swagger';
import { MarketEntity } from 'src/auth/infrastructure/entity/market.entity';

export class CreateMarketDto extends PickType(MarketEntity, [
  'currency_id',
  'language_id',
  'name',
  'access_id',
  'country',
  'phone',
  'email'
] as const) {}
