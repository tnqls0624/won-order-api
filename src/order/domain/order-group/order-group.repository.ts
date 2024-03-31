import { OrderGroup } from './order-group';

export interface OrderGroupRepository {
  findById: (id: number) => Promise<OrderGroup | null>;
  findAllByIds: (ids: number[]) => Promise<OrderGroup[] | null>;
}
