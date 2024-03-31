import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { EventGateway } from 'src/event/gateway/event.gateway';
import {
  OrderMenu,
  OrderMenuProperties
} from 'src/order/domain/order-menu/order-menu';
import { OrderMenuFactory } from 'src/order/domain/order-menu/order-menu.factory';
import { OrderMenuRepository } from 'src/order/domain/order-menu/order-menu.repository';
import { MainOrderStatus } from '../entity/main-order.entity';
import { OrderMenuEntity, OrderMenuStatus } from '../entity/order-menu.entity';
import { OrderEntity } from '../entity/order.entity';
import { InjectionToken } from '../../application/injection-token';
import { OrderGroupPaymentStatus } from '../entity/order-group-payment.entity';
export class OrderMenuRepositoryImplement implements OrderMenuRepository {
  private readonly logger = new Logger(OrderMenuRepositoryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    private readonly eventGateway: EventGateway,
    @Inject(InjectionToken.ORDER_MENU_FACTORY)
    private readonly orderMenuFactory: OrderMenuFactory
  ) {}

  findByTranId: (order_num: string) => Promise<any>;

  async updateQuantity(id: number, main_order_id: number, quantity: number) {
    const order_menu = await this.prisma.order_menu.findFirst({
      where: {
        id
      },
      include: {
        order_group: true,
        menu: true,
        order_menu_option: {
          include: {
            menu_option: true
          }
        }
      }
    });
    if (!order_menu) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER_MENU);

    await this.prisma.order_menu.update({
      where: {
        id
      },
      data: {
        quantity,
        sum:
          (order_menu?.menu.amount +
            order_menu?.order_menu_option.reduce(
              (a, b) => a + (b.menu_option.amount as number),
              0
            )) *
          quantity,
        original_amount: order_menu?.menu.amount * quantity
      }
    });

    const target_order_menus = await this.prisma.order_menu.findMany({
      where: {
        order_group: {
          id: order_menu.order_group.id
        }
      },
      include: {
        menu: true,
        order_menu_option: {
          include: {
            menu_option: true
          }
        }
      }
    });

    let total_amount = 0;
    for (const target_order_menu of target_order_menus) {
      // 기본 메뉴 가격을 totalAmount에 추가
      total_amount +=
        target_order_menu.menu.amount * (target_order_menu.quantity as number);

      // 관련된 모든 order_menu_option의 가격을 totalAmount에 추가

      for (const order_menu_options of target_order_menu.order_menu_option) {
        total_amount +=
          order_menu_options.menu_option.amount *
          (target_order_menu.quantity as number);
      }
    }

    const order_group_payment = await this.prisma.order_group_payment.findFirst(
      {
        where: {
          main_order_id,
          group_id: order_menu.order_group.group_id
        }
      }
    );

    if (!order_group_payment)
      throw new CustomError(RESULT_CODE.NOT_FOUND_PAYMENT);
    await this.prisma.order_group_payment.update({
      where: {
        id: order_group_payment.id
      },
      data: {
        total: total_amount
      }
    });

    const main_order_total = await this.prisma.order_group_payment.aggregate({
      where: {
        main_order_id
      },
      _sum: {
        total: true
      }
    });

    await this.prisma.main_order.update({
      where: {
        id: main_order_id
      },
      data: {
        total: main_order_total._sum.total || 0
      }
    });
    return true;
  }

  async findAllByIds(ids: number[]): Promise<OrderMenu[] | null> {
    try {
      const entities = (await this.prisma.order_menu.findMany({
        where: {
          id: {
            in: ids
          }
        }
      })) as OrderMenuEntity[];
      return entities
        ? entities.map((entity) => this.entityToModel(entity))
        : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async save(data: OrderMenu): Promise<OrderMenuEntity | null> {
    try {
      const entity = this.modelToEntity(data);
      const order = (await this.prisma.order_menu.create({
        data: entity
      })) as OrderMenuEntity;
      return order ? order : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async updates(
    ids: number[],
    main_order_id: number,
    status: OrderMenuStatus
  ): Promise<boolean> {
    try {
      const arr_ids: number[] = Array.isArray(ids) ? ids : Array.from(ids);
      const main_order = await this.prisma.main_order.findFirst({
        where: {
          id: main_order_id
        },
        include: {
          order_group_payment: true
        }
      });
      if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);

      await this.prisma.$transaction(async (tx) => {
        await tx.order_menu.updateMany({
          where: {
            id: {
              in: arr_ids
            }
          },
          data: {
            status
          }
        });

        // 로직 1: CANCEL 상태일 때
        if (status === OrderMenuStatus.CANCEL) {
          for (const id of arr_ids) {
            const order_menu = await tx.order_menu.findFirst({
              where: {
                id
              },
              include: {
                order_group: {
                  include: {
                    order: true,
                    group: {
                      include: {
                        order_group_payment: {
                          where: {
                            main_order_id: main_order.id
                          },
                          include: {
                            main_order: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            });
            if (!order_menu)
              throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER_MENU);

            // 로직 2: 관련된 결제 및 주문 금액 업데이트
            await tx.order_group_payment.update({
              where: {
                id: order_menu.order_group.group.order_group_payment[0].id
              },
              data: {
                total:
                  order_menu.order_group.group.order_group_payment[0].total -
                  order_menu.sum
              }
            });

            await tx.order.update({
              where: {
                id: order_menu.order_group.order.id
              },
              data: {
                total: order_menu.order_group.order.total - order_menu.sum
              }
            });

            await tx.main_order.update({
              where: {
                id: main_order.id
              },
              data: {
                total:
                  order_menu.order_group.group.order_group_payment[0]
                    .main_order!.total - order_menu.sum
              }
            });
          }
        } else if (
          status === OrderMenuStatus.PROGRESS &&
          main_order.status === MainOrderStatus.WAIT
        ) {
          // 로직 3: PROGRESS 상태일 때
          await tx.main_order.update({
            where: {
              id: main_order.id
            },
            data: {
              status: MainOrderStatus.PROGRESS
            }
          });
          const message: any = {
            type: 'MAIN_ORDER',
            market_id: main_order.market_id,
            main_order_id: main_order.id,
            status: MainOrderStatus.PROGRESS
          };
          this.eventGateway.employeeOrderUpdateEvent(message);
          this.eventGateway.masterOrderUpdateEvent(message);
          if (main_order.guest_id) message.guest_id = main_order.guest_id;
          if (main_order.user_id) message.user_id = main_order.user_id;
          this.eventGateway.customerOrderUpdateEvent(message);
        }
      });

      // 로직 4: 모든 그룹의 메뉴 상태 확인 후 메인 주문 상태 업데이트
      const order_groups = await this.prisma.order_group.findMany({
        where: {
          main_order_id: main_order.id
        },
        include: {
          order_menu: true
        }
      });

      let all_menus_complete_or_cancel = true;
      let any_group_complete = false;
      let any_group_cancel = false;

      for (const order_group of order_groups) {
        let group_complete = true;
        let group_cancel = true;

        for (const order_menu of order_group.order_menu) {
          if (order_menu.status !== OrderMenuStatus.COMPLETE) {
            group_complete = false;
          }
          if (order_menu.status !== OrderMenuStatus.CANCEL) {
            group_cancel = false;
          }
        }

        if (!group_complete && !group_cancel) {
          all_menus_complete_or_cancel = false;
        }
        if (group_complete) {
          any_group_complete = true;
        }
        if (group_cancel) {
          any_group_cancel = true;
        }
      }

      const message: any = {
        type: 'MAIN_ORDER',
        market_id: main_order.market_id,
        main_order_id: main_order.id
      };
      if (all_menus_complete_or_cancel) {
        if (any_group_cancel && !any_group_complete) {
          await this.prisma.main_order.update({
            where: { id: main_order.id },
            data: { status: MainOrderStatus.CANCEL }
          });
          message.status = MainOrderStatus.CANCEL;
        } else {
          let cnt = 0;
          for (const payment of main_order.order_group_payment) {
            const payment_length = main_order.order_group_payment.length;
            if (payment.status === OrderGroupPaymentStatus.PAID) {
              cnt++;
            }
            if (cnt === payment_length) {
              await this.prisma.main_order.update({
                where: { id: main_order.id },
                data: { status: MainOrderStatus.COMPLETE }
              });
            }
          }
        }
        this.eventGateway.employeeOrderUpdateEvent(message);
        this.eventGateway.masterOrderUpdateEvent(message);
        if (main_order.guest_id) message.guest_id = main_order.guest_id;
        if (main_order.user_id) message.user_id = main_order.user_id;
        this.eventGateway.customerOrderUpdateEvent(message);
      }

      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async delete(data: OrderMenu): Promise<boolean> {
    try {
      const entity = this.modelToEntity(data);
      (await this.prisma.order.update({
        where: {
          id: entity.id
        },
        data: {
          remove_at: dayjs().toDate()
        }
      })) as OrderEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async findById(id: number): Promise<OrderMenu | null> {
    try {
      const entity = (await this.prisma.order_menu.findFirst({
        where: {
          id
        }
      })) as OrderMenuEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  private modelToEntity(model: OrderMenu): OrderMenuEntity {
    const properties = JSON.parse(JSON.stringify(model)) as OrderMenuProperties;
    return {
      ...properties,
      create_at: properties.create_at,
      remove_at: properties.remove_at
    };
  }
  private entityToModel(entity: OrderMenuEntity): OrderMenu {
    return this.orderMenuFactory.reconstitute({
      ...entity,
      create_at: entity.create_at,
      update_at: entity.update_at,
      remove_at: entity.remove_at
    });
  }
}
