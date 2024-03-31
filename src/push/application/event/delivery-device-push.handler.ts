import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DevicePushEvent } from 'src/push/domain/event/device-push.event';
import { DeliveryDevicePushEvent } from 'src/push/domain/event/delivery-device-push.event';
import { EventDomainService } from 'src/event/domain/event.domain.service';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

@EventsHandler(DeliveryDevicePushEvent)
export class DeliveryDevicePushEventHandler
  implements IEventHandler<DevicePushEvent>
{
  @Inject()
  private readonly eventDomainService: EventDomainService;

  async handle(event: DeliveryDevicePushEvent) {
    try {
      const { message } = event;
      const user_phone = await this.eventDomainService.getUserPhone(message);
      const client = new SNSClient({ region: 'ap-northeast-1' });
      const params = {
        Message: '',
        PhoneNumber: user_phone
      };
      switch (message.type) {
        case 'WRAP': {
          params.Message = `${message.market_name}의 ${
            message.menu_list.length === 1
              ? `${message.menu_list[0].name}`
              : `${message.menu_list[0].name} 외 ${
                  message.menu_list.length - 1
                }개`
          } 포장 음식 준비가 완료되었습니다.`;
          break;
        }
        case 'DELIVERY': {
          params.Message = `${message.market_name}의 ${
            message.menu_list.length === 1
              ? `${message.menu_list[0].name}`
              : `${message.menu_list[0].name} 외 ${
                  message.menu_list.length - 1
                }개`
          } 배달이 완료되었습니다. 맛있게 드세요.`;
          break;
        }
        default:
          break;
      }
      const command = new PublishCommand(params);
      client.send(command);
      return true;
    } catch (error) {
      console.log(error);
    }
  }
}
