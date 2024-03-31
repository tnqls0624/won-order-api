import { IQuery } from '@nestjs/cqrs';
import { PageOptionsDto } from 'src/utils/paginate/dto';
import { AdminDto } from '../../interface/dto/model/admin.dto';

export class FindAllEmployeeQuery implements IQuery {
  constructor(
    readonly admin: AdminDto,
    readonly group_id: number,
    readonly admin_id: string,
    readonly name: string,
    readonly page_query: PageOptionsDto
  ) {}
}
