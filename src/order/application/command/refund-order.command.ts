import { ICommand } from '@nestjs/cqrs';

export class RefundOrderCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly group_id: number
  ) {}
}
