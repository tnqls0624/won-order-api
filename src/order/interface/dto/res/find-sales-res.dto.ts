import { Expose } from 'class-transformer';

export class FindSalesResDto {
  @Expose()
  quantity: number;
  @Expose()
  date: Date;
  @Expose()
  total: number;
  @Expose()
  name: string;
  @Expose()
  group_name: string;
}
