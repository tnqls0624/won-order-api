import { Inject, Logger } from '@nestjs/common';
import { MainOrderStatus, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import {
  MainOrder,
  MainOrderProperties
} from 'src/order/domain/main-order/main-order';
import { MainOrderFactory } from 'src/order/domain/main-order/main-order.factory';
import { MainOrderRepository } from 'src/order/domain/main-order/main-order.repository';
import {
  UpdateOrderDto,
  UpdateOrderMenuDto
} from 'src/order/interface/dto/update-order.dto';
import { MainOrderEntity } from '../entity/main-order.entity';
import { OrderMenuStatus } from '../entity/order-menu.entity';
import { InjectionToken } from '../../application/injection-token';
import { OrderGroupPaymentStatus } from '../entity/order-group-payment.entity';

export class MainOrderRepositoryImplement implements MainOrderRepository {
  private readonly logger = new Logger(MainOrderRepositoryImplement.name);
  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.MAIN_ORDER_FACTORY)
    private readonly mainOrderFactory: MainOrderFactory
  ) {}

  async deleteReceipt(ids: number[]): Promise<boolean> {
    await this.prisma.order_print.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });
    return true;
  }

  async saveReceipt(data: any, group_id: number): Promise<boolean> {
    await this.prisma.order_print.create({
      data: {
        market_id: data.market_id,
        data,
        group_id
      }
    });
    return true;
  }

  async save(data: MainOrder): Promise<MainOrderEntity | null> {
    try {
      const entity = this.modelToEntity(data);
      const order = (await this.prisma.main_order.create({
        data: entity
      })) as MainOrderEntity;
      return order ? order : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async refund(id: number, group_id: number): Promise<boolean> {
    try {
      const main_order = await this.prisma.main_order.findUnique({
        where: {
          id
        },
        include: {
          order_group_payment: {
            ...(group_id && {
              where: {
                group_id
              }
            })
          },
          order: {
            include: {
              order_group: {
                ...(group_id && {
                  where: {
                    group_id
                  }
                }),
                include: {
                  order_menu: true
                }
              }
            }
          }
        }
      });
      if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);

      for (const order of main_order.order) {
        for (const order_group of order.order_group) {
          order_group.order_menu.map(async (order_menu) => {
            await this.prisma.order_menu.update({
              where: {
                id: order_menu.id
              },
              data: {
                status: OrderMenuStatus.CANCEL
              }
            });
          });
        }
      }
      for (const order_group_payment of main_order.order_group_payment) {
        await this.prisma.order_group_payment.update({
          where: {
            id: order_group_payment.id
          },
          data: {
            status: OrderGroupPaymentStatus.REFUND
          }
        });
      }

      // main order status 변경?
      const order_group_payment_length =
        await this.prisma.order_group_payment.count({
          where: {
            main_order_id: main_order.id
          }
        });
      const refund_length = await this.prisma.order_group_payment.count({
        where: {
          main_order_id: main_order.id,
          status: OrderGroupPaymentStatus.REFUND
        }
      });
      if (order_group_payment_length === refund_length) {
        await this.prisma.main_order.update({
          where: {
            id: main_order.id
          },
          data: {
            status: MainOrderStatus.CANCEL
          }
        });
      }
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async update(id: number, status: MainOrderStatus): Promise<boolean> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const main_order = await tx.main_order.findUnique({
          where: {
            id
          },
          include: {
            order_group_payment: true,
            order: {
              include: {
                order_menu: true
              }
            }
          }
        });
        if (!main_order) throw new CustomError(RESULT_CODE.NOT_FOUND_ORDER);

        if (status === MainOrderStatus.COMPLETE) {
          await tx.main_order.update({
            where: {
              id
            },
            data: {
              status
            }
          });
          for (const order of main_order.order) {
            await Promise.all(
              order.order_menu.map(async (order_menu) => {
                await tx.order_menu.update({
                  where: {
                    id: order_menu.id,
                    status: OrderMenuStatus.WAIT
                  },
                  data: {
                    status: OrderMenuStatus.COMPLETE
                  }
                });
              })
            );
          }
        }
        if (status === MainOrderStatus.CANCEL) {
          await tx.main_order.update({
            where: {
              id
            },
            data: {
              status,
              total: 0
            }
          });
          for (const order of main_order.order) {
            await Promise.all(
              order.order_menu.map(async (order_menu) => {
                await tx.order_menu.update({
                  where: {
                    id: order_menu.id
                  },
                  data: {
                    status: OrderMenuStatus.CANCEL
                  }
                });
              })
            );
          }
          for (const order_group_payment of main_order.order_group_payment) {
            await tx.order_group_payment.update({
              where: {
                id: order_group_payment.id
              },
              data: {
                total: 0,
                status: OrderGroupPaymentStatus.NOT_PAID
              }
            });
          }
        }
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async updateOrder(
    main_order_id: number,
    body: UpdateOrderDto
  ): Promise<boolean> {
    try {
      // 주문 및 관련 데이터 불러오기
      const existing_orders = await this.prisma.order.findMany({
        where: { main_order_id },
        include: {
          order_group: {
            include: {
              order_menu: {
                include: {
                  order_menu_option: true
                }
              }
            }
          }
        }
      });
      await this.prisma.$transaction(async (tx: PrismaClient) => {
        let total_main_order = 0;

        if (body.delivery_addr) {
          await tx.main_order.update({
            where: { id: main_order_id },
            data: { delivery_addr: body.delivery_addr }
          });
        }

        for (const existing_order of existing_orders) {
          let total_order = 0;
          // 기존 주문 그룹 ID 추출
          const existing_group_ids = existing_order.order_group.map(
            (group) => group.id
          );
          const provided_group_ids = body.order_groups.map((group) => group.id);

          // 삭제할 주문 그룹 및 관련 주문 메뉴 찾기
          const groups_to_delete = existing_group_ids.filter(
            (id) => !provided_group_ids.includes(id)
          );

          if (groups_to_delete.length > 0) {
            // 연관된 주문 메뉴 옵션 삭제
            await tx.order_menu_option.deleteMany({
              where: {
                order_menu: {
                  order_group_id: { in: groups_to_delete }
                }
              }
            });

            // 연관된 주문 메뉴 삭제
            await tx.order_menu.deleteMany({
              where: {
                order_group_id: { in: groups_to_delete }
              }
            });

            // 주문 그룹 삭제
            await tx.order_group.deleteMany({
              where: { id: { in: groups_to_delete } }
            });
          }

          // 주문 그룹 및 메뉴 처리
          for (const group_dto of body.order_groups) {
            let total_group = 0;

            // 주문 그룹 업데이트 또는 생성
            const order_group = await tx.order_group.upsert({
              where: { id: group_dto.id },
              update: {
                request: group_dto.request
              },
              create: {
                order_id: existing_order.id,
                group_id: group_dto.group_id,
                request: group_dto.request
              },
              include: { order_menu: true }
            });

            // 기존 주문 메뉴 ID 추출
            const existing_menu_ids = order_group.order_menu.map(
              (menu) => menu.id
            );

            const provided_menu_ids = group_dto.order_menus.map(
              (menu) => menu.id
            );

            // 삭제할 주문 메뉴 찾기
            const menus_to_delete = existing_menu_ids.filter(
              (id) => !provided_menu_ids.includes(id)
            );
            if (menus_to_delete.length > 0) {
              // 연관된 주문 메뉴 옵션 삭제
              await tx.order_menu_option.deleteMany({
                where: { order_menu_id: { in: menus_to_delete } }
              });

              // 주문 메뉴 삭제
              await tx.order_menu.deleteMany({
                where: { id: { in: menus_to_delete } }
              });
            }

            // 주문 메뉴 처리
            for (const menu_dto of group_dto.order_menus) {
              // 메뉴 가격 및 옵션 가격 계산
              const menu_sum = await this.calculateMenuSum(menu_dto, tx);
              total_group += menu_sum;

              // 주문 메뉴 업데이트 또는 생성
              await this.upsertOrderMenu(
                menu_dto,
                existing_order.id,
                order_group.id,
                menu_sum,
                tx
              );
            }

            // 주문 그룹 총액 업데이트
            await tx.order_group_payment.update({
              where: {
                group_id_main_order_id: {
                  group_id: group_dto.group_id,
                  main_order_id
                }
              },
              data: { total: total_group }
            });

            total_order += total_group;
          }

          // 주문 총액 업데이트
          await tx.order.update({
            where: { id: existing_order.id },
            data: { total: total_order }
          });

          total_main_order += total_order;
        }

        // 메인 주문 총액 업데이트
        await tx.main_order.update({
          where: { id: main_order_id },
          data: { total: total_main_order }
        });
      });

      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private async calculateMenuSum(
    menu_dto: UpdateOrderMenuDto,
    prisma: PrismaClient
  ): Promise<number> {
    // 메뉴 기본 가격 가져오기
    const menu_price = await prisma.menu.findUnique({
      where: { id: menu_dto.menu_id },
      select: { amount: true }
    });

    if (!menu_price) return 0;

    let menu_sum = menu_price.amount * (menu_dto.quantity || 1);

    // 옵션 가격 계산
    const option_prices = await Promise.all(
      menu_dto.menu_options.map(async (optionId) => {
        const option = await prisma.menu_option.findUnique({
          where: { id: optionId },
          select: { amount: true }
        });
        return option ? option.amount : 0;
      })
    );

    const total_option_price =
      option_prices.reduce((acc, curr) => acc + curr, 0) *
      (menu_dto.quantity || 1);
    menu_sum += total_option_price;

    return menu_sum;
  }

  private async upsertOrderMenu(
    menu_dto: UpdateOrderMenuDto,
    order_id: number,
    order_group_id: number,
    menu_sum: number,
    prisma: PrismaClient
  ) {
    try {
      let new_order_menu: any;
      const menu = await prisma.menu.findUnique({
        where: {
          id: menu_dto.menu_id
        }
      });
      if (menu_dto.id) {
        // 기존 주문 메뉴 업데이트
        await prisma.order_menu.update({
          where: { id: menu_dto.id },
          data: {
            order_id,
            menu_id: menu_dto.menu_id,
            order_group_id,
            quantity: menu_dto.quantity,
            // status: menu_dto.status,
            sum: menu_sum,
            original_amount: menu!.amount
          }
        });

        await prisma.order_menu_option.deleteMany({
          where: {
            order_menu_id: menu_dto.id
          }
        });

        for (const menu_option_id of menu_dto.menu_options) {
          const menu_option_entity = await this.prisma.menu_option.findUnique({
            where: {
              id: menu_option_id
            }
          });
          await prisma.order_menu_option.create({
            data: {
              order_menu_id: menu_dto.id,
              menu_option_id,
              original_amount: menu_option_entity!.amount
            }
          });
        }
      } else {
        // 새 주문 메뉴 생성
        new_order_menu = await prisma.order_menu.create({
          data: {
            order_id,
            menu_id: menu_dto.menu_id,
            order_group_id,
            quantity: menu_dto.quantity,
            sum: menu_sum,
            original_amount: menu!.amount
          }
        });
        for (const menu_option_id of menu_dto.menu_options) {
          const menu_option_entity = await this.prisma.menu_option.findUnique({
            where: {
              id: menu_option_id
            }
          });
          await prisma.order_menu_option.create({
            data: {
              order_menu_id: new_order_menu.id,
              menu_option_id,
              original_amount: menu_option_entity!.amount
            }
          });
        }
      }
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async delete(data: MainOrder): Promise<boolean> {
    try {
      const entity = this.modelToEntity(data);
      (await this.prisma.main_order.update({
        where: {
          id: entity.id
        },
        data: {
          remove_at: dayjs().toDate()
        }
      })) as MainOrderEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async findById(id: number): Promise<MainOrder | null> {
    try {
      const entity = (await this.prisma.main_order.findFirst({
        where: {
          id
        },
        include: {
          table: true,
          order: {
            include: {
              order_menu: {
                include: {
                  order_menu_option: {
                    include: {
                      menu_option: true
                    }
                  }
                }
              }
            }
          }
        }
      })) as MainOrderEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: MainOrder): MainOrderEntity {
    const properties = JSON.parse(JSON.stringify(model)) as MainOrderProperties;
    return {
      ...properties,
      create_at: properties.create_at,
      update_at: properties.update_at,
      remove_at: null
    };
  }

  private entityToModel(entity: MainOrderEntity): MainOrder {
    return this.mainOrderFactory.reconstitute({
      ...entity,
      create_at: entity.create_at,
      update_at: entity.update_at,
      remove_at: null
    });
  }
}
