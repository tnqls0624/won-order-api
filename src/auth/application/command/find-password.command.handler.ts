import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/password.module';
import { UserDomainService } from 'src/auth/domain/user.domain.service';
import { UserRepository } from 'src/auth/domain/user.repository';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';

import { InjectionToken } from '../Injection-token';
import { FindPasswordCommand } from './find-password.command';

@CommandHandler(FindPasswordCommand)
export class FindPassWordCommandHandler
  implements ICommandHandler<FindPasswordCommand, boolean>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(InjectionToken.USER_DOMAIN_SERVICE)
    private readonly userDomainService: UserDomainService,
    @Inject(PASSWORD_GENERATOR)
    private readonly passwordGenerator: PasswordGenerator
  ) {}

  async execute(command: FindPasswordCommand) {
    const { body } = command;
    const { country_code, phone, password, token, code } = body;

    const user = await this.userRepository.findByPhone(phone);
    if (!user) throw new CustomError(RESULT_CODE.NOT_FOUND_USER);
    const hash = await this.passwordGenerator.generateHash(password);
    await this.userDomainService.chagePassword({
      user,
      password: hash,
      country_code,
      phone,
      token,
      code
    });
    return true;
  }
}
