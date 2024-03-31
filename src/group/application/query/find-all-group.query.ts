import { IQuery } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class FindAllGroupQuery implements IQuery {
  constructor(readonly admin: AdminDto) {}
}
