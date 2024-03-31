import { ICommand } from '@nestjs/cqrs';

export class RefundAbaOrderCommand implements ICommand {
  constructor(readonly id: number) {}
}
