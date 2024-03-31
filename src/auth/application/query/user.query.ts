import { UserEntity } from 'src/auth/infrastructure/entity/user.entity';
import { Provider } from '../../../types/login.type';

export interface UserQuery {
  findById: (id: number) => Promise<UserEntity | null>;
  findByPhone: (phone: string) => Promise<UserEntity | null>;
  findByPhoneWithNoRemove: (phone: string) => Promise<UserEntity | null>;
  findAddress: (user_id: string, guest_id: string) => Promise<any>;
  findAll: (phone: string, nickname: string) => Promise<any[]>;
  checkDuplicateByNickName: (nickname: string) => Promise<UserEntity | null>;
  checkDuplicateByPhone: (phone: string) => Promise<UserEntity | null>;
  findOneByTokenAndProvider: (
    token: string,
    provider: Provider
  ) => Promise<UserEntity | null>;
}
