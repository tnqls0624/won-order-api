import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from 'src/auth/domain/user.repository';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { DeleteUserAddressCommand } from './delete-user-address.command';
import { RESULT_CODE } from 'src/constant';
import CustomError from 'src/common/error/custom-error';

@CommandHandler(DeleteUserAddressCommand)
export class DeleteUserAddressCommandHandler
  implements ICommandHandler<DeleteUserAddressCommand, boolean>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  async execute(command: DeleteUserAddressCommand): Promise<boolean> {
    const { id } = command;
    const address = await this.userRepository.findAddress(id);
    if (!address) throw new CustomError(RESULT_CODE.NOT_FOUND_ADDRESS);
    await this.userRepository.deleteAddress(id);
    return true;
  }
}
