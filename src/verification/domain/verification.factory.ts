import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { VerificationType } from '@prisma/client';

import {
  Verification,
  VerificationImplement,
  VerificationProperties
} from './verification';

type CreateVerificationOptions = Readonly<{
  type: VerificationType;
  phone: string;
  token: string;
  code: string;
}>;

export class VerificationFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateVerificationOptions): Verification {
    return this.eventPublisher.mergeObjectContext(
      new VerificationImplement({
        ...options,
        create_at: new Date(),
        update_at: new Date()
      })
    );
  }

  reconstitute(properties: VerificationProperties): Verification {
    return this.eventPublisher.mergeObjectContext(
      new VerificationImplement(properties)
    );
  }
}
