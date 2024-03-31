import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import SMSApi from '../../infrastructure/sms_api';
import { RequestSmsEvent } from '../../domain/event/request-sms.event';

@EventsHandler(RequestSmsEvent)
export class RequestSmsEventHandler implements IEventHandler<RequestSmsEvent> {
  constructor(private readonly smsApi: SMSApi) {}
  private readonly logger = new Logger(this.constructor.name);
  async handle(event: RequestSmsEvent) {
    const { phone, code } = event as RequestSmsEvent;
    await this.smsApi.requestAuth(phone, code);
  }
}
