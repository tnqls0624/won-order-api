import { ICommand } from '@nestjs/cqrs';

export class CreateSaleStatsCommand implements ICommand {
  constructor(readonly id: number, readonly group_id: string, readonly geo: string) {}
}
