import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { CreateContactCommand } from './create-contact.command';
import { ContactRepository } from '../../domain/contact.repository';
import { ContactFactory } from '../../domain/contact.factory';
import { ContactStatus } from '../../../types/contact.type';

@CommandHandler(CreateContactCommand)
export class CreateContactCommandHandler
  implements ICommandHandler<CreateContactCommand>
{
  constructor(
    @Inject(InjectionToken.CONTACT_REPOSITORY)
    private readonly contactRepository: ContactRepository,
    @Inject(InjectionToken.CONTACT_FACTORY)
    private readonly contactFactory: ContactFactory
  ) {}

  async execute(command: CreateContactCommand) {
    const { body } = command;
    const comment = this.contactFactory.create({
      ...body,
      processor: null,
      answer_content: null,
      answer_title: null,
      status: ContactStatus.WAIT
    });
    return this.contactRepository.save(comment);
  }
}
