import { ICommand } from '@nestjs/cqrs';

export class UpdateAllOrderStatusCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly group_id: string
  ) {}
}
