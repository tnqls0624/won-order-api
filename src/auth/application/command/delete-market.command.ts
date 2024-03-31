import { ICommand } from '@nestjs/cqrs';

export class DeleteMarketCommand implements ICommand {
  constructor(readonly id: number) {}
}
