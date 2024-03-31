import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from 'src/auth/domain/user';
import { UserFactory } from 'src/auth/domain/user.factory';
import { UserRepository } from 'src/auth/domain/user.repository';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/password.module';
import { CreateUserCommand } from './create-user.command';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, User | null>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(InjectionToken.USER_FACTORY)
    private readonly userFactory: UserFactory,
    @Inject(PASSWORD_GENERATOR)
    private readonly passwordGenerator: PasswordGenerator
  ) {}

  async execute(command: CreateUserCommand): Promise<User | null> {
    const { body } = command;
    const { phone, password } = body;
    if (!phone) throw new CustomError(RESULT_CODE.AUTH_NEED_PHONE_NUMBER);
    if (!password)
      throw new CustomError(RESULT_CODE.AUTH_INVALID_USER_PASSWORD);
    const hash = await this.passwordGenerator.generateHash(password);
    const user = this.userFactory.create({
      ...body,
      password: hash
    });
    return this.userRepository.save(user);
  }
}
