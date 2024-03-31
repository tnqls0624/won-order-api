import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class DeleteCustomQRCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly id: number
  ) {}
}
