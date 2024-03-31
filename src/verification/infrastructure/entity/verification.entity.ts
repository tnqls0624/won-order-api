import { VerificationType } from '@prisma/client';
import { BaseEntity } from './base.entity';

export class VerificationEntity extends BaseEntity {
  type: VerificationType;

  phone: string;

  token: string;

  code: string;
}
