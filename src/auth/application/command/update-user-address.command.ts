import { ICommand } from '@nestjs/cqrs';
import { UpdateAddressDto } from 'src/auth/interface/dto/req/update-address.dto';

export class UpdateUserAddressCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly body: UpdateAddressDto
  ) {}
}
