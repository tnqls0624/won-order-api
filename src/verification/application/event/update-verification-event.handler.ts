import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { VerificationRepository } from 'src/verification/domain/verification.repository';
import { UpdateVerificationEvent } from 'src/verification/domain/event/update-verification.event';

@EventsHandler(UpdateVerificationEvent)
export class UpdateVerificationEventHandler
  implements IEventHandler<UpdateVerificationEvent>
{
  @Inject(InjectionToken.VERIFICATION_REPOSITORY)
  private readonly verificationRepository: VerificationRepository;

  async handle(event: UpdateVerificationEvent) {
    const { id, token, code } = event as UpdateVerificationEvent;
    this.verificationRepository.update(id, token, code);
    return true;
  }
}
