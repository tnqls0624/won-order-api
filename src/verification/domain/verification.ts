import { AggregateRoot } from '@nestjs/cqrs';
import { VerificationType } from '@prisma/client';
import dayjs from 'dayjs';
import { DeleteVerificationEvent } from './event/delete-verification.event';
import { RequestSmsEvent } from './event/request-sms.event';
import { UpdateVerificationEvent } from './event/update-verification.event';

export type VerificationEssentialProperties = Readonly<
  Required<{
    phone: string;
    token: string;
    type: VerificationType;
    code: string;
  }>
>;

export type VerificationOptionalProperties = Readonly<
  Partial<{
    create_at: Date;
    update_at: Date;
  }>
>;

export type VerificationProperties = VerificationEssentialProperties &
  Required<VerificationOptionalProperties>;

export interface Verification {
  delete: () => void;
  request: (phone: string, code: string) => void;
  update: (token: string, code: string) => void;
}

export class VerificationImplement
  extends AggregateRoot
  implements Verification
{
  private readonly id: number;
  private type: VerificationType;
  private phone: string;
  private token: string;
  private code: string;
  private create_at: Date;
  private update_at: Date;

  constructor(properties: VerificationProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }
  update(token: string, code: string) {
    this.token = token;
    this.code = code;
    this.update_at = dayjs().toDate();
    this.apply(new UpdateVerificationEvent(this.id, this.token, this.code));
  }
  request(phone: string, code: string): void {
    this.phone = phone;
    this.code = code;
    this.update_at = dayjs().toDate();
    this.apply(new RequestSmsEvent(phone, code));
  }

  delete(): void {
    this.apply(new DeleteVerificationEvent(this.id));
  }
}
