import { ICommand } from '@nestjs/cqrs';
import { RegistDeviceDto } from 'src/push/interface/dto/regist-device.dto';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class RegistDeviceCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly body: RegistDeviceDto
  ) {}
}
