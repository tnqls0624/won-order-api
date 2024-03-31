import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessageHandler, Topic } from 'libs/message.module';
import { OrderCompletedCommand } from '../application/command/order-completed.command';

@Controller()
export class EventController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessageHandler(Topic.ORDER_COMPLETED)
  async orderCompleted(message: OrderCompletedCommand): Promise<boolean> {
    await this.commandBus.execute(new OrderCompletedCommand(message));
    return true;
  }
}
