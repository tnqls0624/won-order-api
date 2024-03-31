import { ICommand } from '@nestjs/cqrs';
import { VerificationType } from 'src/types/verification.type';
import { SmsAuthVerifyDto } from '../../interface/dto/sms-auth-verify.dto';

export class VerifySmsCommand implements ICommand {
  constructor(
    readonly type: VerificationType,
    readonly body: SmsAuthVerifyDto
  ) {}
}
