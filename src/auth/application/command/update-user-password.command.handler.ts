import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from 'src/auth/domain/user.repository';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { RESULT_CODE } from 'src/constant';
import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/password.module';
import { UpdateUserPasswordCommand } from './update-user-password.command';

@CommandHandler(UpdateUserPasswordCommand)
export class UpdatePasswordCommandHandler
  implements ICommandHandler<UpdateUserPasswordCommand>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_GENERATOR)
    private readonly passwordGenerator: PasswordGenerator
  ) {}

  async execute(command: UpdateUserPasswordCommand) {
    const { id, body } = command;
    const { password } = body;
    if (!password) throw new NotFoundException(RESULT_CODE.AUTH_NEED_PASSWORD);
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(RESULT_CODE.NOT_FOUND_USER);
    const hash = await this.passwordGenerator.generateHash(password);
    user.updatePassword(hash);
    return true;
  }
}
