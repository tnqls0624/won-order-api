import { IQuery } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { PageOptionsDto } from 'src/utils/paginate/dto';

export class FindAllCustomQRQuery implements IQuery {
  constructor(
    readonly admin: AdminDto,
    readonly page_options: PageOptionsDto
  ) {}
}
