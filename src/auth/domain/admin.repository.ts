import { MainOrderStatus } from 'src/order/infrastructure/entity/main-order.entity';
import { AdminEntity } from '../infrastructure/entity/admin.entity';
import { Admin } from './admin';
import { AdminType, LoginType } from 'src/types/login.type';
import { UpdateEmployeeDto } from '../interface/dto/req/update-employee.dto';
import { UpdateMasterDto } from '../interface/dto/req/update-master.dto';

export interface AdminRepository {
  save: (user: Admin | Admin[]) => Promise<AdminEntity | null>;
  delete: (id: number) => Promise<Admin | null>;
  update: (id: number, body: UpdateEmployeeDto) => Promise<boolean>;
  updateMaster: (id: number, body: UpdateMasterDto) => Promise<boolean>;
  findByMasterId: (type: AdminType, id: number) => Promise<Admin | null>;
  findById: (id: number) => Promise<Admin | null>;
  updatePassword: (id: number, password: string) => Promise<Admin | null>;
  validateAdmin: (
    type: LoginType,
    market_id: number | undefined,
    signname: string
  ) => Promise<any | null>;
  findMarket: (id: number) => Promise<any | null>;
  createSaleStats: (
    market_id: number,
    group_id: string,
    geo: string
  ) => Promise<any>;
  updateAllOrderStatus: (
    market_id: number,
    group_id: string,
    status: MainOrderStatus
  ) => Promise<boolean>;
}
