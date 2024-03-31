import { ICommand } from '@nestjs/cqrs';

export class RecoveryUserCommand implements ICommand {
  constructor(readonly phone: string) {}
}
