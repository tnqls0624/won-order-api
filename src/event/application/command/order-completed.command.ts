import { ICommand } from '@nestjs/cqrs';

export class OrderCompletedCommand implements ICommand {
  constructor(readonly message: any) {}
}
