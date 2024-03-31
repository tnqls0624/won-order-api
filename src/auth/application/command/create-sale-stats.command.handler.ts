import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { RESULT_CODE } from 'src/constant';
import { CreateSaleStatsCommand } from './create-sale-stats.command';
import { AdminRepository } from 'src/auth/domain/admin.repository';
import { AdminQuery } from '../query/admin.query';
import CustomError from 'src/common/error/custom-error';

@CommandHandler(CreateSaleStatsCommand)
export class CreateSaleStatsCommandHandler
  implements ICommandHandler<CreateSaleStatsCommand>
{
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository,
    @Inject(InjectionToken.ADMIN_QUERY)
    private readonly adminQuery: AdminQuery
  ) {}

  async execute(command: CreateSaleStatsCommand): Promise<boolean> {
    const { id, group_id, geo } = command;
    const admin = await this.adminRepository.findById(id);
    if (!admin) throw new NotFoundException(RESULT_CODE.NOT_FOUND_ADMIN);

    const main_order = await this.adminQuery.findAlreadyOrder(admin.get().market_id);
    if(main_order) throw new CustomError(RESULT_CODE.HAVE_PENDING_AND_PROGRESS_ORDERS);
    admin.createSaleStats(group_id, geo);
    return true;
  }
}
