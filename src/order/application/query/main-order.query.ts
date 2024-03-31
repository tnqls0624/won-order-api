import { MainOrderEntity } from 'src/order/infrastructure/entity/main-order.entity';
import { OrderMenuStatus } from 'src/order/infrastructure/entity/order-menu.entity';
import { FindOrdersAdminParams } from 'src/order/interface/param/find-orders-admin.params';
import { FindOrdersParams } from 'src/order/interface/param/find-orders.params';
import { FindSalesParams } from 'src/order/interface/param/find-sales.params';
import { MainOrderTypeEnum } from 'src/types';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { PageOptionsDto } from 'src/utils/paginate/dto';

export interface MainOrderQuery {
  findById: (
    id: number,
    order_menu_status: OrderMenuStatus,
    language_code: string
  ) => Promise<any>;
  findFirstMainOrderById: (id: number) => Promise<MainOrderEntity>;
  findByOrderNum: (order_num: string) => Promise<any>;
  validateOrder: (additional_where: any) => Promise<any>;
  findSales: (
    admin: AdminDto,
    params: FindSalesParams,
    page_option: PageOptionsDto
  ) => Promise<any>;
  findProducts: (
    admin: AdminDto,
    order_menu_stats_id: number,
    group_id: string
  ) => Promise<any>;
  findDashboardSalesTotal: (admin: AdminDto, time_zone: string) => Promise<any>;
  findDashboardSalesMenus: (admin: AdminDto, time_zone: string) => Promise<any>;
  findDashboardSalesRank: (admin: AdminDto, time_zone: string) => Promise<any>;
  findByAdminWithOrderId: (
    admin: AdminDto,
    group_ids: string[] | undefined,
    main_order_id: number,
    order_menu_status: OrderMenuStatus
  ) => Promise<any>;
  findAll: (
    user_id: number,
    params: FindOrdersParams,
    page_options: PageOptionsDto
  ) => Promise<any>;
  findAllByAdmin: (
    admin: AdminDto,
    params: FindOrdersAdminParams,
    page_options: PageOptionsDto
  ) => Promise<any>;
  findByOrderPossibleUser: (
    table_id: number,
    user_id: number,
    type: MainOrderTypeEnum
  ) => Promise<MainOrderEntity>;
  findByOrderPossibleGuest: (
    table_id: number,
    guest_id: string,
    type: MainOrderTypeEnum
  ) => Promise<MainOrderEntity>;
  findAllPrintByMarketId: (market_id: number, group_id: number) => Promise<any>;
  findReceiptById: (
    market_id: number,
    group_id: number,
    id: number,
    language_code: string
  ) => Promise<any>;
  findMenus: (id: number) => Promise<any>;
  findMenuTypes: (id: number) => Promise<any>;
}
