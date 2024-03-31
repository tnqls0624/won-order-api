import { UpdateAuthDto } from '../interface/dto/req/update-auth.dto';
import { User } from './user';
import { UserEntity } from '../infrastructure/entity/user.entity';
import { UpdateAddressDto } from '../interface/dto/req/update-address.dto';
import { AddrListEntity } from '../infrastructure/entity/addr_list.entity';

export interface UserRepository {
  saveEntity: (user: User | User[]) => Promise<UserEntity | null>;
  delete: (id: number) => Promise<boolean>;
  deleteAddress: (id: number) => Promise<boolean>;
  findById: (id: number) => Promise<User | null>;
  findAddress: (id: number) => Promise<AddrListEntity | null>;
  findByPhone: (phone: string) => Promise<User | null>;
  recovery: (id: number) => Promise<boolean>;
  update: (id: number, body: UpdateAuthDto) => Promise<boolean>;
  updateAddress: (id: number, body: UpdateAddressDto) => Promise<boolean>;
  validateUser: (signname: string) => Promise<{
    id: number;
    token: string | null;
    phone: string | null;
    provider: string | null;
    nickname: string | null;
    address: string | null;
    remove_at: Date | null;
    create_at: Date;
    update_at: Date;
  } | null>;
}
