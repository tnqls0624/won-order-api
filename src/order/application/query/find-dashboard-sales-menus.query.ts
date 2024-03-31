import { IQuery } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class FindDashboardSalesMenusQuery implements IQuery {
  constructor(
    readonly admin: AdminDto,
    readonly time_zone: string
  ) {}
}
