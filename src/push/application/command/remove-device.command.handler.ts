import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PushRepository } from 'src/push/domain/push.repository';
import { InjectionToken } from '../Injection-token';
import { RemoveDeviceCommand } from './remove-device.command';

@CommandHandler(RemoveDeviceCommand)
export class RemoveDeviceCommandHandler
  implements ICommandHandler<RemoveDeviceCommand>
{
  constructor(
    @Inject(InjectionToken.PUSH_REPOSITORY)
    private readonly pushRepository: PushRepository
  ) {}

  async execute(command: RemoveDeviceCommand) {
    const { admin } = command;
    const push_token = await this.pushRepository.findByUserId(admin.id);
    if (!push_token) return true;
    await this.pushRepository.delete(push_token.id as number);
    return true;
  }
}
