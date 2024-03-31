import { IQuery } from '@nestjs/cqrs';
import { PageOptionsDto } from '../../../utils/paginate/dto';

export class FindAllNoticeQuery implements IQuery {
  constructor(
    readonly group_id: number,
    readonly market_id: number,
    readonly page_options: PageOptionsDto
  ) {}
}
