import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from 'src/group/domain/group.repository';
import { InjectionToken } from '../injection-token';
import { UpdateGroupTlCommand } from './update-group-tl.command';

@CommandHandler(UpdateGroupTlCommand)
export class UpdateGroupTlCommandHandler
  implements ICommandHandler<UpdateGroupTlCommand>
{
  constructor(
    @Inject(InjectionToken.GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepository
  ) {}

  async execute(command: UpdateGroupTlCommand) {
    const { body } = command;
    await this.groupRepository.updateGroupTl(body);
    return true;
  }
}
