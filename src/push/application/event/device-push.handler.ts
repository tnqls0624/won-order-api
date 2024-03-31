import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { PushDomainService } from 'src/push/domain/push.domain.service';
import { DevicePushEvent } from 'src/push/domain/event/device-push.event';
import { TableQuery } from 'src/table/application/query/table.query';
import { EventDomainService } from 'src/event/domain/event.domain.service';
import { Translate } from '@google-cloud/translate/build/src/v2';
import { GroupQuery } from 'src/group/application/query/group.query';
import { PrismaClient } from '@prisma/client';
import { MainOrderTypeEnum } from 'src/types';

@EventsHandler(DevicePushEvent)
export class DevicePushEventHandler implements IEventHandler<DevicePushEvent> {
  gcp: Translate;
  constructor(@Inject('PRISMA_CLIENT') private prisma: PrismaClient) {
    this.gcp = new Translate({
      projectId: process.env.GOOGLE_PROJECT_ID,
      key: process.env.GOOGLE_KEY
    });
  }

  @Inject(InjectionToken.TABLE_QUERY)
  private readonly tableQuery: TableQuery;

  @Inject(InjectionToken.GROUP_QUERY)
  private readonly groupQuery: GroupQuery;

  @Inject()
  private readonly pushDomainService: PushDomainService;

  @Inject() private readonly eventDomainService: EventDomainService;

  async handle(event: DevicePushEvent) {
    try {
      const { message } = event;
      if (message.order) {
        await this.processMessage(message);
      } else {
        await this.processCallMessage(message);
      }

      return true;
    } catch (error) {
      console.log(error);
    }
  }

  private async processMessage(message: any) {
    for (const order_group of message.order.order_groups) {
      try {
        const unique_employee = await this.eventDomainService.getAllEmployeeIds(
          [parseInt(order_group.group_id)],
          message.main_order.market_id
        );
        unique_employee.map(async (employee) => {
          const grouped_messages_totals =
            await this.getGroupedMessagesAndTotals(
              order_group,
              employee.language_id
            );
          if (message.main_order.type === MainOrderTypeEnum.HALL) {
            const table = await this.tableQuery.findByIdWithLanguageId(
              message.main_order.table_id,
              employee.language_id
            );

            table.group.group_tl.map(
              async (group_tl: { language_id: number }) => {
                if (employee.language_id === group_tl.language_id)
                  await this.sendPushMessage(
                    [employee.id],
                    `[ NEW ] ${table.group.group_tl[0]?.name}#${table?.table_num}`,
                    `${grouped_messages_totals?.message} $${grouped_messages_totals?.total}`,
                    message,
                    'default'
                  );
              }
            );
          } else {
            await this.sendPushMessage(
              [employee.id],
              `[ NEW ] ${
                message.main_order.type === MainOrderTypeEnum.DELIVERY
                  ? MainOrderTypeEnum.DELIVERY
                  : message.main_order.type === MainOrderTypeEnum.WRAP
                  ? MainOrderTypeEnum.WRAP
                  : ''
              }#${message.main_order.order_num.slice(-4)}`,
              `${grouped_messages_totals?.message} $${grouped_messages_totals?.total}`,
              message,
              'default'
            );
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  private async getGroupedMessagesAndTotals(
    order_group: any,
    language_id: number
  ): Promise<{ message: string; total: number }> {
    const grouped_message_total = {
      message: '',
      total: 0
    };

    // 메뉴 항목 카운트
    const order_menu_count = order_group.order_menus.length;
    for (let i = 0; i < order_menu_count; i++) {
      const order_menu = order_group.order_menus[i];
      grouped_message_total.total += order_menu.sum;

      const menu_translation = await this.prisma.menu_tl.findUnique({
        where: {
          menu_id_language_id: {
            menu_id: order_menu.menu_id,
            language_id: language_id
          }
        }
      });

      const menu_name = menu_translation
        ? menu_translation.name
        : order_menu.menu.name;

      // 첫 번째 메뉴 이름을 설정하고, 나머지는 '외 몇 건' 형태로 표시
      if (i === 0) {
        grouped_message_total.message = menu_name;
      } else if (i === 1) {
        grouped_message_total.message += ` And ${
          order_menu_count - 1
        } Other Items`;
        break; // 첫 번째 이후의 메뉴는 더 이상 추가하지 않음
      }
    }

    return grouped_message_total;
  }

  private async sendPushMessage(
    employee_ids: number[],
    title: string,
    body: string,
    message: any,
    ring: string
  ) {
    await this.pushDomainService.sendMessage(employee_ids, {
      title,
      body,
      data: message,
      ring
    });
  }

  private async processCallMessage(message: any) {
    try {
      const unique_employee = await this.eventDomainService.getAllEmployeeIds(
        [Number(message.target_group_id)],
        message.market_id
      );

      unique_employee.map(async (employee) => {
        const table = await this.tableQuery.findByNumWithLanguageGroupId(
          message.table_num,
          message.group_id,
          employee.language_id
        );
        const target_group = await this.groupQuery.findByIdIncludeGroupTl(
          message.target_group_id,
          employee.language_id
        );
        table.group.group_tl.map(
          async (group_tl: { language_id: number; name: any }) => {
            if (employee.language_id === group_tl.language_id) {
              await this.sendPushMessage(
                [employee.id],
                `[CALL] ${table.group.group_tl[0].name}#${table?.table_num}`,
                `${target_group.group_tl[0].name}`,
                message,
                'call.mp3'
              );
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }
}
