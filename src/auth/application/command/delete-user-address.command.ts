import { ICommand } from '@nestjs/cqrs';

export class DeleteUserAddressCommand implements ICommand {
  constructor(readonly id: number) {}
}
