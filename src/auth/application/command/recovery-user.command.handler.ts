import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { RESULT_CODE } from 'src/constant';
import { RecoveryUserCommand } from './recovery-user.command';
import { UserRepository } from 'src/auth/domain/user.repository';

@CommandHandler(RecoveryUserCommand)
export class RecoveryUserCommandHandler
  implements ICommandHandler<RecoveryUserCommand>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  async execute(command: RecoveryUserCommand): Promise<boolean> {
    const { phone } = command;
    const user = await this.userRepository.findByPhone(phone);
    if (!user) throw new NotFoundException(RESULT_CODE.NOT_FOUND_USER);
    user.recovery();
    return true;
  }
}
