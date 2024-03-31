import { ICommand } from '@nestjs/cqrs';
import { CreateMarketDto } from 'src/auth/interface/dto/req/create-market.dto';

export class CreateMarketCommand implements ICommand {
  constructor(readonly body: CreateMarketDto) {}
}
