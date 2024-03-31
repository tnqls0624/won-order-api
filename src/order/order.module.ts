import { forwardRef, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderController } from './interface/order.controller';
import { MenuModule } from 'src/menu/menu.module';
import { CacheStoreModule } from 'src/cache/cache.module';
import { GroupModule } from 'src/group/group.module';
import { JwtService } from '@nestjs/jwt';
import { MessageModule } from 'libs/message.module';
import { SettingModule } from 'src/setting/setting.module';
import { ValidationModule } from 'libs/order-validation.module';
import { CreateOrderCommandHandler } from './application/command/create-order.command.handler';
import { InjectionToken } from './application/injection-token';
import { OrderQueryImplement } from './infrastructure/query/order.query.implement';
import { OrderFactory } from './domain/order/order.factory';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrderRepositoryImplement } from './infrastructure/repository/order.repository.implement';
import { MainOrderRepositoryImplement } from './infrastructure/repository/main-order.repository.implement';
import { MainOrderQueryImplement } from './infrastructure/query/main-order.query.implement';
import { MainOrderFactory } from './domain/main-order/main-order.factory';
import { FindAllMainOrdersQueryHandler } from './application/query/find-all-main-order.query.handler';
import { FindMainOrderQueryHandler } from './application/query/find-main-order.query.handler';
import { FindAllMainOrdersAdminQueryHandler } from './application/query/find-all-main-order-admin.query.handler';
import { UpdateMainOrderEventHndler } from './application/event/update-main-order.handler';
import { UpdateMainOrderStatusCommandHandler } from './application/command/update-main-order-status.command.handler';
import { OrderGroupRepositoryImplement } from './infrastructure/repository/order-group.repository.implement';
import { OrderGroupFactory } from './domain/order-group/order-group.factory';
import { UpdateOrderGroupPaymentEventHndler } from './application/event/update-order-group-payment.handler';
import { UpdateOrderMenuCommandHandler } from './application/command/update-order-menu.command.handler';
import { OrderMenuRepositoryImplement } from './infrastructure/repository/order-menu.repository.implement';
import { OrderMenuFactory } from './domain/order-menu/order-menu.factory';
import { UpdateOrderCommandHandler } from './application/command/update-order.command.handler';
import { UpdateOrderEventHndler } from './application/event/update-order.handler';
import { FindMainOrderAdminQueryHandler } from './application/query/find-main-order-admin.query.handler';
import { EventModule } from 'src/event/event.module';
import { UpdateOrderGroupPaymentsStatusCommandHandler } from './application/command/update-order-group-payments-status.command.handler';
import { OrderGroupPaymentRepositoryImplement } from './infrastructure/repository/order-group-payment.repository.implement';
import { OrderGroupPaymentFactory } from './domain/order-group-payment/order-group-payment.factory';
import { FindSalesQueryHandler } from './application/query/find-sales.query.handler';
import { UpdateMainOrderStatusForUserCommandHandler } from './application/command/update-main-order-status-for-user.command.handler';
import { TableModule } from 'src/table/table.module';
import { UpdateOrderMenuQuantityCommandHandler } from './application/command/update-order-menu-quantity.command.handler';
import { UpdateQuantityEventHndler } from './application/event/update-quantity.handler';
import { FindAllPrintQueryHandler } from './application/query/find-all-print.query.handler';
import { CreateReceiptEventHndler } from './application/event/create-receipt.handler';
import { CreateReceiptPrintCommandHandler } from './application/command/create-receipt-print.command.handler';
import { DeleteReceiptPrintCommandHandler } from './application/command/delete-receipt-print.command.handler';
import { OrderTransactionFactory } from './domain/order-transaction/order-transaction.factory';
import { OrderTransactionRepositoryImplement } from './infrastructure/repository/order-transaction.repository.implement';
import { UpdateOrderTransactionCommandHandler } from './application/command/update-order-transaction.command.handler';
import { UpdateOrderTransactionEventHandler } from './application/event/update-order-transaction.handler';
import { FindProductsQueryHandler } from './application/query/find-products.query.handler';
import { FindDashboardSalesTotalQueryHandler } from './application/query/find-dashboard-sales-total.query.handler';
import { FindDashboardSalesMenusQueryHandler } from './application/query/find-dashboard-sales-menus.query.handler';
import { FindDashboardSalesRankQueryHandler } from './application/query/find-dashboard-sales-rank.query.handler';
import { RefundAbaOrderCommandHandler } from './application/command/refund-aba-order.command.handler';
import { RefundAbaOrderEventHandler } from './application/event/refund-aba-order.handler';
import { RefundOrderCommandHandler } from './application/command/refund-order.command.handler';
import { RefundOrderEventHandler } from './application/event/refund-order.handler';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.ORDER_REPOSITORY,
    useClass: OrderRepositoryImplement
  },
  {
    provide: InjectionToken.ORDER_QUERY,
    useClass: OrderQueryImplement
  },
  {
    provide: InjectionToken.MAIN_ORDER_QUERY,
    useClass: MainOrderQueryImplement
  },
  {
    provide: InjectionToken.MAIN_ORDER_REPOSITORY,
    useClass: MainOrderRepositoryImplement
  },
  {
    provide: InjectionToken.ORDER_GROUP_REPOSITORY,
    useClass: OrderGroupRepositoryImplement
  },
  {
    provide: InjectionToken.ORDER_MENU_REPOSITORY,
    useClass: OrderMenuRepositoryImplement
  },
  {
    provide: InjectionToken.ORDER_GROUP_PAYMENT_REPOSITORY,
    useClass: OrderGroupPaymentRepositoryImplement
  },
  {
    provide: InjectionToken.MAIN_ORDER_FACTORY,
    useClass: MainOrderFactory
  },
  {
    provide: InjectionToken.ORDER_FACTORY,
    useClass: OrderFactory
  },
  {
    provide: InjectionToken.ORDER_GROUP_FACTORY,
    useClass: OrderGroupFactory
  },
  {
    provide: InjectionToken.ORDER_GROUP_PAYMENT_FACTORY,
    useClass: OrderGroupPaymentFactory
  },
  {
    provide: InjectionToken.ORDER_MENU_FACTORY,
    useClass: OrderMenuFactory
  },
  {
    provide: InjectionToken.ORDER_TRANSACTION_FACTORY,
    useClass: OrderTransactionFactory
  },
  {
    provide: InjectionToken.ORDER_TRANSACTION_REPOSITORY,
    useClass: OrderTransactionRepositoryImplement
  }
];

const domain = [
  OrderFactory,
  OrderMenuFactory,
  OrderGroupPaymentFactory,
  MainOrderFactory,
  OrderGroupFactory,
  OrderTransactionFactory
];

const application = [
  CreateOrderCommandHandler,
  UpdateOrderCommandHandler,
  UpdateOrderMenuCommandHandler,
  JwtService,
  FindAllMainOrdersQueryHandler,
  FindMainOrderQueryHandler,
  FindAllMainOrdersAdminQueryHandler,
  UpdateMainOrderEventHndler,
  UpdateMainOrderStatusCommandHandler,
  UpdateOrderGroupPaymentsStatusCommandHandler,
  UpdateOrderGroupPaymentEventHndler,
  UpdateOrderEventHndler,
  FindMainOrderAdminQueryHandler,
  FindSalesQueryHandler,
  FindDashboardSalesTotalQueryHandler,
  UpdateMainOrderStatusForUserCommandHandler,
  UpdateOrderMenuQuantityCommandHandler,
  UpdateQuantityEventHndler,
  FindAllPrintQueryHandler,
  CreateReceiptPrintCommandHandler,
  CreateReceiptEventHndler,
  DeleteReceiptPrintCommandHandler,
  UpdateOrderTransactionCommandHandler,
  UpdateOrderTransactionEventHandler,
  RefundAbaOrderEventHandler,
  RefundAbaOrderCommandHandler,
  RefundOrderEventHandler,
  RefundOrderCommandHandler,
  FindProductsQueryHandler,
  FindDashboardSalesMenusQueryHandler,
  FindDashboardSalesRankQueryHandler
];

@Module({
  imports: [
    MessageModule,
    CqrsModule,
    CacheStoreModule,
    GroupModule,
    MenuModule,
    SettingModule,
    ValidationModule,
    PrismaModule,
    TableModule,
    forwardRef(() => EventModule)
  ],
  controllers: [OrderController],
  providers: [...application, ...infrastructure, ...domain],
  exports: [...infrastructure]
})
export class OrderModule {}
