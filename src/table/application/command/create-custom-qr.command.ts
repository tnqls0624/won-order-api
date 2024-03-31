import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { CreateCustomQRDto } from 'src/table/interface/dto/create-custom-qr.dto';

export class CreateCustomQRCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly body: CreateCustomQRDto
  ) {}
}
