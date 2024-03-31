import { TableEntity } from '../infrastructure/entity/table.entity';
import { Table } from './table';

export interface TableRepository {
  save: (table: Table | Table[]) => Promise<TableEntity | null>;
  customQRSave: (body: any) => Promise<any | null>;
  delete: (id: number) => Promise<boolean>;
  deleteCustomQR: (id: number) => Promise<boolean>;
  updateCustomQR: (id: number, body: any) => Promise<boolean>;
  findById: (id: number) => Promise<Table | null>;
  findTableByTableNum: (
    group_id: number,
    table_num: string
  ) => Promise<Table | null>;
  findAll: (group_id: number) => Promise<Table[] | null>;
}
