import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/auth/auth.module';
import { OrderModule } from 'src/order/order.module';
import { PushModule } from 'src/push/push.module';
import { OrderCompletedCommandHandler } from './application/command/order-completed.command.handler';
import { EventDomainService } from './domain/event.domain.service';
import { EventGateway } from './gateway/event.gateway';
import { EventController } from './interface/event.controller';

const application = [OrderCompletedCommandHandler, EventGateway];

const domain = [EventDomainService];

@Module({
  imports: [
    CqrsModule,
    PushModule,
    AuthModule,
    PushModule,
    forwardRef(() => OrderModule)
  ],
  controllers: [EventController],
  providers: [...application, ...domain],
  exports: [...application, ...domain]
})
export class EventModule {}
