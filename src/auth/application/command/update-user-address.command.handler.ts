import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from 'src/auth/domain/user.repository';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { UpdateUserAddressCommand } from './update-user-address.command';
import { RESULT_CODE } from 'src/constant';
import CustomError from 'src/common/error/custom-error';

@CommandHandler(UpdateUserAddressCommand)
export class UpdateUserAddressCommandHandler
  implements ICommandHandler<UpdateUserAddressCommand>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  async execute(command: UpdateUserAddressCommand) {
    const { id, body } = command;
    const address = await this.userRepository.findAddress(id);
    if (!address) throw new CustomError(RESULT_CODE.NOT_FOUND_ADDRESS);
    await this.userRepository.updateAddress(id, body);
    return true;
  }
}
