import { PushEntity } from '../infrastructure/entity/push.entity';
import { Push } from './push';

export interface PushRepository {
  save: (push: Push) => Promise<PushEntity | null>;
  delete: (id: number) => Promise<boolean>;
  findByUserId: (user_id: number) => Promise<PushEntity | null>;
  findBySerial: (serial: string) => Promise<PushEntity | null>;
  findAll: (user_ids: number[]) => Promise<string[]>;
  update: (id: number, token: string) => Promise<boolean>;
}
