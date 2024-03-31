import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from 'src/auth/domain/user.repository';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { RESULT_CODE } from 'src/constant';
import { DeleteUserCommand } from './delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand, boolean>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  async execute(command: DeleteUserCommand): Promise<boolean> {
    const { id } = command;
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(RESULT_CODE.NOT_FOUND_USER);
    user.withdrawal();
    return true;
  }
}
