import { ICommand } from '@nestjs/cqrs';
import { CreateOrderDto } from 'src/order/interface/dto/create-order.dto';

export class CreateOrderCommand implements ICommand {
  constructor(readonly body: CreateOrderDto) {}
}
