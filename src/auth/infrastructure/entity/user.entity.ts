import { BaseEntity } from './base.entity';
import { Provider } from '../../../types/login.type';

export class UserEntity extends BaseEntity {
  nickname: string;
  token: string;
  provider: Provider;
}
