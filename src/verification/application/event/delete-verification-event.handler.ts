import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteVerificationEvent } from '../../domain/event/delete-verification.event';
import { InjectionToken } from '../Injection-token';
import { VerificationRepository } from 'src/verification/domain/verification.repository';

@EventsHandler(DeleteVerificationEvent)
export class DeleteVerificationEventHandler
  implements IEventHandler<DeleteVerificationEvent>
{
  @Inject(InjectionToken.VERIFICATION_REPOSITORY)
  private readonly verificationRepository: VerificationRepository;

  async handle(event: DeleteVerificationEvent) {
    const { id } = event as DeleteVerificationEvent;
    this.verificationRepository.delete(id);
    return true;
  }
}
