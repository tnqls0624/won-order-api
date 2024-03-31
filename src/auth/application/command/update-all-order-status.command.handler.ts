import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { RESULT_CODE } from 'src/constant';
import { MainOrderStatus } from 'src/order/infrastructure/entity/main-order.entity';
import { AdminRepository } from 'src/auth/domain/admin.repository';
import { UpdateAllOrderStatusCommand } from './update-all-order-status.command';

@CommandHandler(UpdateAllOrderStatusCommand)
export class UpdateAllOrderStatusCommandHandler
  implements ICommandHandler<UpdateAllOrderStatusCommand>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository
  ) {}

  async execute(command: UpdateAllOrderStatusCommand): Promise<boolean> {
    const { id, group_id } = command;
    const admin = await this.adminRepository.findById(id);
    if (!admin) throw new NotFoundException(RESULT_CODE.NOT_FOUND_ADMIN);
    admin.updateAllOrderStatus(group_id, MainOrderStatus.CANCEL);
    return true;
  }
}
