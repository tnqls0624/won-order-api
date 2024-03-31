import { ICommand } from '@nestjs/cqrs';
import { VerificationType } from '@prisma/client';
import { SmsAuthRequestDto } from '../../interface/dto/sms-auth-request.dto';

export class RequestSmsCommand implements ICommand {
  constructor(
    readonly type: VerificationType,
    readonly body: SmsAuthRequestDto
  ) {}
}
