import { LogoEntity } from '../infrastructure/entity/logo.entity';
import { Logo } from './logo';

export interface LogoRepository {
  save: (image: Logo, market_id: number) => Promise<LogoEntity | null>;
  delete: (id: number) => Promise<boolean>;
  findByHash: (hash: string) => Promise<LogoEntity | null>;
}
