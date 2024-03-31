import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { RESULT_CODE } from 'src/constant';
import { DeleteMarketCommand } from './delete-market.command';
import { MarketRepository } from 'src/auth/domain/market.repository';

@CommandHandler(DeleteMarketCommand)
export class DeleteMarketCommandHandler
  implements ICommandHandler<DeleteMarketCommand, boolean>
{
  constructor(
    @Inject(InjectionToken.MARKET_REPOSITORY)
    private readonly marketRepository: MarketRepository
  ) {}

  async execute(command: DeleteMarketCommand): Promise<boolean> {
    const { id } = command;
    const market = await this.marketRepository.findById(id);
    if (!market) throw new NotFoundException(RESULT_CODE.NOT_FOUND_MARKET);
    market.withdrawal();
    return true;
  }
}
