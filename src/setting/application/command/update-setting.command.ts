import { ICommand } from '@nestjs/cqrs';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { UpdateSettingDto } from '../../interface/dto/update-setting.dto';

export class UpdateSettingCommand implements ICommand {
  constructor(
    readonly admin: AdminDto,
    readonly id: number,
    readonly body: UpdateSettingDto
  ) {}
}
