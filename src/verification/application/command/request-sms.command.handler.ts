import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerificationType } from '@prisma/client';
import { TokenGenerator, TOKEN_GENERATOR } from 'libs/token.module';
import { UserQuery } from 'src/auth/application/query/user.query';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { VerificationFactory } from 'src/verification/domain/verification.factory';
import { VerificationRepository } from 'src/verification/domain/verification.repository';
import { InjectionToken } from '../Injection-token';
import { RequestSmsCommand } from './request-sms.command';

@CommandHandler(RequestSmsCommand)
export class RequestSmsCommandHandler
  implements ICommandHandler<RequestSmsCommand>
{
  constructor(
    @Inject(InjectionToken.VERIFICATION_REPOSITORY)
    private readonly verificationRepository: VerificationRepository,
    @Inject(InjectionToken.USER_QUERY)
    private readonly userQuery: UserQuery,
    @Inject(InjectionToken.VERIFICATION_FACTORY)
    private readonly verificationFactory: VerificationFactory,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async execute(command: RequestSmsCommand) {
    const { type, body } = command;

    if (type === VerificationType.SMS) {
      const user = await this.userQuery.findByPhoneWithNoRemove(body.phone);
      if (user?.remove_at) throw new CustomError(RESULT_CODE.REMOVED_USER);
      if (user) throw new CustomError(RESULT_CODE.DUPLICATED_PHONE);
    } else if (
      type === VerificationType.PASSWORD ||
      type === VerificationType.RECOVERY
    ) {
      const user = await this.userQuery.findByPhone(body.phone);
      if (!user) throw new CustomError(RESULT_CODE.NOT_FOUND_USER);
    }

    const code = this.tokenGenerator.generateToken('0123456789', 6);
    const token = this.tokenGenerator.generateToken(
      '0123456789abcdefghijklmnopqrstuvwxyz',
      10
    );

    const international_phone = `${body.country_code}${body.phone}`;
    let verification = await this.verificationRepository.findByPhoneWithType(
      type,
      international_phone
    );
    if (verification) {
      verification.update(token, code);
    } else {
      verification = this.verificationFactory.create({
        type,
        phone: international_phone,
        token,
        code
      });
      await this.verificationRepository.save(verification);
    }
    verification.request(international_phone, code);

    return { token };
  }
}
