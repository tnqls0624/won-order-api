import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import CustomError from 'src/common/error/custom-error';
import { EventGateway } from 'src/event/gateway/event.gateway';
import { DevicePushEvent } from 'src/push/domain/event/device-push.event';
import { OrderCompletedCommand } from './order-completed.command';

@CommandHandler(OrderCompletedCommand)
export class OrderCompletedCommandHandler
  implements ICommandHandler<OrderCompletedCommand>
{
  private readonly logger = new Logger(OrderCompletedCommandHandler.name);

  constructor(
    private readonly eventGateway: EventGateway,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: OrderCompletedCommand) {
    const { message } = command;
    try {
      this.logger.log(JSON.stringify(message));
      this.eventGateway.employeeOrderSendEvent(message); // 점원에게 전송
      this.eventGateway.masterOrderSendEvent(message); // 마스터 어드민에게 전송
      this.eventBus.publish(new DevicePushEvent(message)); // 점원 디바이스 푸시
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
}
