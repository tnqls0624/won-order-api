import { AggregateRoot } from '@nestjs/cqrs';
import { Language } from '@prisma/client';
import { AdminType } from 'src/types/login.type';
import { DeleteAdminEvent } from './event/delete-admin.event';
import { UpdateAdminPasswordEvent } from './event/update-admin-password.event';
import { UpdateEmployeeEvent } from './event/update-employee.event';
import { MainOrderStatus } from 'src/order/infrastructure/entity/main-order.entity';
import { UpdateAllOrderStatusEvent } from './event/update-all-order-status.event';
import { CreateSaleStatsEvent } from './event/create-sale-stats.event';
import { UpdateEmployeeDto } from '../interface/dto/req/update-employee.dto';
import { UpdateMasterDto } from '../interface/dto/req/update-master.dto';
import { UpdateMasterEvent } from './event/update-master.event';

export type AdminEssentialProperties = Readonly<
  Required<{
    market_id: number | null;
    admin_id: string;
    language_id: number;
    type: AdminType;
    nickname: string;
    password: string;
    create_at: Date;
    update_at: Date;
  }>
>;

export type AdminOptionalProperties = Readonly<
  Partial<{
    remove_at: Date | null;
  }>
>;

export type AdminProperties = Required<AdminEssentialProperties> &
  AdminOptionalProperties;

export interface Admin {
  updatePassword: (password: string) => void;
  delete: () => void;
  update: (body: UpdateEmployeeDto) => void;
  updateMaster: (body: UpdateMasterDto) => void;
  createSaleStats: (group_id: string, geo: string) => void;
  get: () => any;
  updateAllOrderStatus: (group_id: string, status: MainOrderStatus) => void;
}

export class AdminImplement extends AggregateRoot implements Admin {
  private readonly id: number;
  private readonly market_id: number;
  private type: AdminType;
  private admin_id: string;
  private password: string;
  private nickname: string;
  private language: Language;
  private remove_at: Date | null;
  private create_at: Date;
  private update_at: Date;

  constructor(properties: AdminProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }

  updatePassword(password: string) {
    this.apply(new UpdateAdminPasswordEvent(this.id, password));
  }

  update(body: UpdateEmployeeDto) {
    this.apply(new UpdateEmployeeEvent(this.id, body));
  }

  delete() {
    this.apply(new DeleteAdminEvent(this.id));
  }

  get() {
    return {
      id: this.id,
      market_id: this.market_id,
      type: this.type,
      admin_id: this.admin_id,
      nickname: this.nickname
    };
  }

  updateAllOrderStatus(group_id: string, status: MainOrderStatus) {
    this.apply(new UpdateAllOrderStatusEvent(this.market_id, group_id, status));
  }

  async createSaleStats(group_id: string, geo: string) {
    this.apply(new CreateSaleStatsEvent(this.market_id, group_id, geo));
  }

  async updateMaster(body: UpdateMasterDto): Promise<void> {
    this.apply(new UpdateMasterEvent(this.id, body));
  }
}
