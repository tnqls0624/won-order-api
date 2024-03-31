import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from 'src/auth/domain/user.repository';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { RESULT_CODE } from 'src/constant';
import { UpdateUserCommand } from './update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  async execute(command: UpdateUserCommand) {
    const { id, body } = command;
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(RESULT_CODE.NOT_FOUND_USER);
    user.update(body);
    return true;
  }
}
