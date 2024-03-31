import { Inject } from '@nestjs/common';
import { User } from 'src/auth/domain/user';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { VerificationType } from 'src/types/verification.type';
import { InjectionToken } from 'src/verification/application/Injection-token';
import { VerificationRepository } from 'src/verification/domain/verification.repository';

export class ChagePasswordUserOptions {
  readonly user: User;
  readonly password: string;
  readonly country_code: string;
  readonly phone: string;
  readonly token: string;
  readonly code: string;
}

export class UserDomainService {
  constructor(
    @Inject(InjectionToken.VERIFICATION_REPOSITORY)
    private readonly verificationRepository: VerificationRepository
  ) {}

  async chagePassword({
    user,
    password,
    country_code,
    phone,
    token,
    code
  }: ChagePasswordUserOptions): Promise<void> {
    const verification = await this.verificationRepository.findByAll(
      VerificationType.PASSWORD,
      `${country_code}${phone}`,
      token,
      code
    );
    if (!verification)
      throw new CustomError(RESULT_CODE.NOT_FOUND_VERIFICATION);
    verification.delete();
    user.changePassword(password);
  }
}
