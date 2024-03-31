import { Expose } from 'class-transformer';

export class FindAllOrderByUserResDto {
  @Expose()
  group_id: number;
  @Expose()
  group_name: string;
  @Expose()
  total: number;
}
