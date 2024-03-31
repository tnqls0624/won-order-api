import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { ContactRepository } from '../../domain/contact.repository';
import { ContactFactory } from '../../domain/contact.factory';
import { ReplyContactCommand } from './reply-contact.command';
import CustomError from '../../../common/error/custom-error';
import { RESULT_CODE } from '../../../constant';

@CommandHandler(ReplyContactCommand)
export class ReplyContactCommandHandler
  implements ICommandHandler<ReplyContactCommand>
{
  constructor(
    @Inject(InjectionToken.CONTACT_REPOSITORY)
    private readonly contactRepository: ContactRepository,
    @Inject(InjectionToken.CONTACT_FACTORY)
    private readonly contactFactory: ContactFactory
  ) {}

  async execute(command: ReplyContactCommand) {
    const { id, admin, body } = command;
    const contact = await this.contactRepository.findById(id);
    if (!contact) throw new CustomError(RESULT_CODE.NOT_FOUND_CONTACT);
    contact.reply(body, admin.id);
    return true;
  }
}
