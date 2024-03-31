import { Expose } from 'class-transformer';

export class FindMenuRankResDto {
  @Expose()
  name: string;
  @Expose()
  count: number;
  @Expose()
  total: number;
  @Expose()
  w360: string;
  @Expose()
  group_name: string;
}
