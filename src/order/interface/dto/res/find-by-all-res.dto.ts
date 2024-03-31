import { Expose } from 'class-transformer';

export class FindSalesResDto {
  @Expose()
  group_id: number;
  @Expose()
  group_name: string;
  @Expose()
  sales: any[];
}
