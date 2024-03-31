import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { UpdateMarketCommand } from './update-market.command';
import { MarketRepository } from 'src/auth/domain/market.repository';
import { MarketQuery } from '../query/market.query';

@CommandHandler(UpdateMarketCommand)
export class UpdateMarketCommandHandler
  implements ICommandHandler<UpdateMarketCommand>
{
  constructor(
    @Inject(InjectionToken.MARKET_REPOSITORY)
    private readonly marketRepository: MarketRepository,
    @Inject(InjectionToken.MARKET_QUERY)
    private readonly marketQuery: MarketQuery
  ) {}

  async execute(command: UpdateMarketCommand) {
    const { id, body } = command;
    const market = await this.marketRepository.findById(id);
    if (!market) throw new CustomError(RESULT_CODE.NOT_CREATE_MARKET);

    if (body.access_id) {
      const duplicated_access_id = await this.marketQuery.findByAccessId(
        body.access_id
      );
      if (duplicated_access_id)
        throw new CustomError(RESULT_CODE.DUPLICATED_MARKET_ACCESS_ID);
    }

    if (body.name) {
      const duplicated_name = await this.marketQuery.findByName(body.name);
      if (duplicated_name)
        throw new CustomError(RESULT_CODE.DUPLICATED_MARKET_NAME);
    }

    market.update(body);
    return true;
  }
}
