import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { PushFactory } from 'src/push/domain/push.factory';
import { PushRepository } from 'src/push/domain/push.repository';
import { InjectionToken } from '../Injection-token';
import { RegistDeviceCommand } from './regist-device.command';

@CommandHandler(RegistDeviceCommand)
export class RegistDeviceCommandHandler
  implements ICommandHandler<RegistDeviceCommand>
{
  constructor(
    @Inject(InjectionToken.PUSH_REPOSITORY)
    private readonly pushRepository: PushRepository,
    @Inject(InjectionToken.PUSH_FACTORY)
    private readonly pushFactory: PushFactory
  ) {}

  async execute(command: RegistDeviceCommand) {
    const { admin, body } = command;
    const { serial, token, platform } = body;
    if (!token) throw new CustomError(RESULT_CODE.NOT_FOUND_PUSH_TOKEN);
    if (!serial) throw new CustomError(RESULT_CODE.NOT_FOUND_DEVICE_SERIAL);
    if (!platform) throw new CustomError(RESULT_CODE.NOT_FOUND_DEVICE_PLATFORM);
    const push = this.pushFactory.create({
      user_id: admin.id,
      ...body
    });
    return this.pushRepository.save(push);
  }
}
