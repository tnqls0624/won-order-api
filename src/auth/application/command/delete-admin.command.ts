import { ICommand } from '@nestjs/cqrs';

export class DeleteAdminCommand implements ICommand {
  constructor(readonly id: number) {}
}
