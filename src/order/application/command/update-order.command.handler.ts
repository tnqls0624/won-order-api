import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { UpdateOrderCommand } from './update-order.command';
import {
  INTEGRATION_EVENT_PUBLISHER,
  IntegrationEventPublisher,
  Topic,
  OrderUpdated
} from 'libs/message.module';
import { UpdateOrderDto } from 'src/order/interface/dto/update-order.dto';
import { SaveOrderResult } from 'src/types';
import { RESULT_CODE } from 'src/constant';
import { MainOrderRepository } from 'src/order/domain/main-order/main-order.repository';
import { InjectionToken } from '../injection-token';

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderCommandHandler
  implements ICommandHandler<UpdateOrderCommand>
{
  private readonly logger = new Logger(UpdateOrderCommandHandler.name);

  constructor(
    @Inject(InjectionToken.MAIN_ORDER_REPOSITORY)
    private readonly mainOrderRepository: MainOrderRepository,
    @Inject(INTEGRATION_EVENT_PUBLISHER)
    private readonly integrationEventPublisher: IntegrationEventPublisher
  ) {}

  async execute(command: UpdateOrderCommand) {
    try {
      const { id, body } = command;
      const main_order = await this.mainOrderRepository.findById(id);
      if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);
      main_order.updateOrder(body);
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  /* 주문정보 생성용 SNS Publisher 메소드. 실제 주문 정보 생성은 SNS -> SQS -> 람다함수에서 수행된다 */
  async updateOrderToSNS(
    id: number,
    body: UpdateOrderDto
  ): Promise<SaveOrderResult> {
    /* AWS SNS에 전송 */

    const message = {
      main_order_id: id,
      ...body
    };
    await this.integrationEventPublisher.publish(
      Topic.ORDER_UPDATED,
      new OrderUpdated(JSON.stringify(message))
    );

    return { result: 'PUBLISHED' };
  }
}
