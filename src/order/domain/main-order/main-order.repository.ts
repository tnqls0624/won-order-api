import { MainOrderStatus } from '@prisma/client';
import { MainOrderEntity } from 'src/order/infrastructure/entity/main-order.entity';
import { UpdateOrderDto } from 'src/order/interface/dto/update-order.dto';
import { MainOrder } from './main-order';

export interface MainOrderRepository {
  save: (order: MainOrder) => Promise<MainOrderEntity | null>;
  saveReceipt: (data: any, group_id: number) => Promise<boolean>;
  update: (id: number, status: MainOrderStatus) => Promise<boolean>;
  refund: (id: number, group_id: number) => Promise<boolean>;
  updateOrder: (id: number, body: UpdateOrderDto) => Promise<boolean>;
  delete: (order: MainOrder) => Promise<boolean>;
  findById: (id: number) => Promise<MainOrder | null>;
  deleteReceipt: (ids: number[]) => Promise<boolean>;
}
