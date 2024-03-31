import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../injection-token';
import { MainOrderQuery } from '../query/main-order.query';
import { CreateReceiptEvent } from 'src/order/domain/event/create-receipt.event';
import { MainOrderRepository } from 'src/order/domain/main-order/main-order.repository';

@EventsHandler(CreateReceiptEvent)
export class CreateReceiptEventHndler
  implements IEventHandler<CreateReceiptEvent>
{
  constructor(
    @Inject(InjectionToken.MAIN_ORDER_REPOSITORY)
    private readonly mainOrderRepository: MainOrderRepository,
    @Inject(InjectionToken.MAIN_ORDER_QUERY)
    private readonly mainOrderQuery: MainOrderQuery
  ) {}

  async handle(event: CreateReceiptEvent) {
    const { market_id, group_id, id, language_code } = event;

    const main_order = await this.mainOrderQuery.findReceiptById(
      market_id,
      group_id,
      id,
      language_code
    );

    const receipt_data = {
      id: main_order.id,
      order_num: main_order.order_num,
      market_id: main_order.market_id,
      table_num: main_order.table?.table_num || 'N/A', // 테이블 번호가 없는 경우 'N/A'
      group_name: main_order.table?.group?.group_tl[0]?.name || 'N/A', // 그룹 이름이 없는 경우 'N/A'
      total: 0,
      delivery_addr: main_order.delivery_addr || '',
      currency_code: main_order.currency_code || '',
      wifi_ssid: main_order?.table?.group?.setting?.wifi_ssid || '',
      wifi_password: main_order?.table?.group?.setting?.wifi_password || '',
      comment: main_order?.table?.group?.setting?.comment || '',
      address: main_order?.table?.group?.setting?.address || '',
      pay_type: main_order?.order_group_payment[0]?.pay_type || '',
      orders: main_order.order_group_payment.flatMap((order_group_payment) =>
        order_group_payment.order_group.map((order_group) => ({
          order_menu: order_group.order_menu.map((menu) => ({
            id: menu.id,
            status: menu.status || '',
            sum: menu.sum || 0,
            original_amount: menu.original_amount || 0,
            quantity: menu.quantity || 0,
            category_name:
              menu.menu?.menu_category?.menu_category_tl[0]?.name || 'N/A', // 카테고리 이름이 없는 경우 'N/A'
            menu_name: menu.menu?.menu_tl[0]?.name || 'N/A', // 메뉴 이름이 없는 경우 'N/A'
            order_menu_option:
              menu.order_menu_option?.map((option) => ({
                id: option.id,
                original_amount: option.original_amount || 0,
                option_name:
                  option.menu_option?.menu_option_tl[0]?.name || 'N/A', // 옵션 이름이 없는 경우 'N/A'
                category_name:
                  option.menu_option?.menu_option_category
                    ?.menu_option_category_tl[0]?.name || 'N/A' // 옵션 카테고리 이름이 없는 경우 'N/A'
              })) || []
          }))
        }))
      )
    };

    receipt_data.total = receipt_data.orders
      .flatMap((order) => order.order_menu)
      .reduce((acc, menu) => acc + menu.sum, 0);

    await this.mainOrderRepository.saveReceipt(receipt_data, group_id);
    return receipt_data;
  }
}
