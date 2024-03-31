import { ICommand } from '@nestjs/cqrs';
import { UpdateMarketDto } from 'src/auth/interface/dto/req/update-market.dto';

export class UpdateMarketCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly body: UpdateMarketDto
  ) {}
}
