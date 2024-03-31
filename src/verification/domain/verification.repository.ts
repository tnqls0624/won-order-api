import { VerificationType } from '@prisma/client';
import { VerificationEntity } from '../infrastructure/entity/verification.entity';
import { Verification } from './verification';

export interface VerificationRepository {
  save: (
    verification: Verification | Verification[]
  ) => Promise<VerificationEntity | null>;
  update: (id: number, token: string, code: string) => Promise<boolean>;
  delete: (id: number) => Promise<boolean>;
  findById: (id: number) => Promise<Verification | null>;
  findByPhoneWithType: (
    type: VerificationType,
    phone: string
  ) => Promise<Verification | null>;
  findByAll: (
    type: VerificationType,
    phone: string,
    token: string,
    code: string
  ) => Promise<Verification | null>;
  find: (phone: string, code: string) => Promise<Verification | null>;
}
