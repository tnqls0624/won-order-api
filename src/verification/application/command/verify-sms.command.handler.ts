import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { VerificationRepository } from 'src/verification/domain/verification.repository';
import { InjectionToken } from '../Injection-token';
import { VerifySmsCommand } from './verify-sms.command';

@CommandHandler(VerifySmsCommand)
export class VerifySmsCommandHandler
  implements ICommandHandler<VerifySmsCommand>
{
  @Inject(InjectionToken.VERIFICATION_REPOSITORY)
  private readonly verificationRepository: VerificationRepository;

  async execute(command: VerifySmsCommand) {
    const { body } = command;
    const { phone, code, country_code } = body;
    const international_phone = `${country_code}${phone}`;
    const verification = await this.verificationRepository.find(
      international_phone,
      code
    );
    if (!verification)
      throw new CustomError(RESULT_CODE.AUTH_INVALID_VERIFICATION_CODE);
    verification.delete();
    return true;
  }
}
