import { Expose } from 'class-transformer';

class DailyStatsDto {
  quantity: number;
  total: number;
}

export class FindDashboardResDto {
  @Expose()
  today: DailyStatsDto;
  @Expose()
  yesterday: DailyStatsDto;
  @Expose()
  month_sales: DailyStatsDto;
}
