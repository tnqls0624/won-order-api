import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { CreateMarketCommand } from './create-market.command';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { MarketFactory } from 'src/auth/domain/market.factory';
import { MarketRepository } from 'src/auth/domain/market.repository';
import { MarketQuery } from '../query/market.query';

@CommandHandler(CreateMarketCommand)
export class CreateMarketCommandHandler
  implements ICommandHandler<CreateMarketCommand>
{
  constructor(
    @Inject(InjectionToken.MARKET_REPOSITORY)
    private readonly marketRepository: MarketRepository,
    @Inject(InjectionToken.MARKET_QUERY)
    private readonly marketQuery: MarketQuery,
    @Inject(InjectionToken.MARKET_FACTORY)
    private readonly marketFactory: MarketFactory
  ) {}

  async execute(command: CreateMarketCommand) {
    const { body } = command;
    const market_model = this.marketFactory.create({
      ...body
    });

    const duplicated_access_id = await this.marketQuery.findByAccessId(
      body.access_id
    );
    if (duplicated_access_id)
      throw new CustomError(RESULT_CODE.DUPLICATED_MARKET_ACCESS_ID);

    const duplicated_name = await this.marketQuery.findByName(body.name);
    if (duplicated_name)
      throw new CustomError(RESULT_CODE.DUPLICATED_MARKET_NAME);
    const market = await this.marketRepository.save(market_model);
    if (!market) throw new CustomError(RESULT_CODE.NOT_CREATE_MARKET);
    return true;
  }
}
