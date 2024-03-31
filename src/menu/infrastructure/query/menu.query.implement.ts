import { Inject, Logger } from '@nestjs/common';
import { Language, PrismaClient } from '@prisma/client';
import CustomError from 'src/common/error/custom-error';
import { MenuQuery } from 'src/menu/application/query/menu.query';
import { MenuEntity, MenuStatus } from '../entity/menu.entity';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

enum MenuCategoryStatus {
  BLIND = 'BLIND',
  FOR_SALE = 'FOR_SALE',
  SOLD_OUT = 'SOLD_OUT'
}

type WhereMenuCondition = {
  menu_category_id: number;
  remove_at: null;
  status?: MenuStatus;
};

export class MenuQueryImplement implements MenuQuery {
  private readonly logger = new Logger(MenuQueryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findMenuOptionCategoryTl(id: number): Promise<any> {
    const language = await this.prisma.language.findMany({
      include: {
        menu_option_category_tl: {
          where: {
            menu_option_category_id: id
          }
        }
      }
    });
    return language;
  }

  async findMenuCategoryTl(id: number): Promise<any> {
    const language = await this.prisma.language.findMany({
      include: {
        menu_category_tl: {
          where: {
            menu_category_id: id
          }
        }
      }
    });
    return language;
  }

  async findMenuOptionTl(id: number): Promise<any | null> {
    const language = await this.prisma.language.findMany({
      include: {
        menu_option_tl: {
          where: {
            menu_option_id: id
          }
        }
      }
    });
    return language;
  }

  async findMenuTl(id: number): Promise<any | null> {
    const language = await this.prisma.language.findMany({
      where: {},
      include: {
        menu_tl: {
          where: {
            menu_id: id
          }
        }
      }
    });
    return language;
  }
  async findAllUserMenu(
    market_id: number,
    language_code: Language
  ): Promise<any | null> {
    try {
      const language = await this.prisma.language.findFirst({
        where: {
          code: language_code
        }
      });
      const menus = await this.prisma.group.findMany({
        where: {
          market_id,
          remove_at: null
        },
        include: {
          group_tl: {
            select: {
              name: true
            },
            where: {
              language_id: language?.id
            }
          },
          setting: {
            select: {
              name: true,
              address: true,
              start_business_hours: true,
              end_business_hours: true,
              start_break_time: true,
              end_break_time: true,
              tel: true,
              logo: {
                select: {
                  w120: true,
                  w360: true
                }
              }
            }
          },
          market: {
            select: {
              id: true,
              name: true,
              access_id: true,
              country: true,
              phone: true,
              email: true,
              currency: true
            }
          },
          menu_category: {
            where: {
              remove_at: null,
              status: {
                in: [MenuCategoryStatus.FOR_SALE, MenuCategoryStatus.SOLD_OUT]
              }
            },
            orderBy: [{ index: 'asc' }, { id: 'asc' }],
            include: {
              menu_category_tl: {
                where: {
                  language_id: language?.id
                }
              },
              menu: {
                where: {
                  remove_at: null,
                  status: {
                    in: [MenuStatus.FOR_SALE, MenuStatus.SOLD_OUT]
                  }
                },
                orderBy: [{ index: 'asc' }, { id: 'asc' }],
                include: {
                  menu_tl: {
                    where: {
                      language_id: language?.id
                    }
                  },
                  menu_on_image: {
                    include: {
                      image: true
                    }
                  },
                  menu_option_category: {
                    where: {
                      remove_at: null
                    },
                    orderBy: [{ index: 'asc' }, { id: 'asc' }],
                    include: {
                      menu_option_category_tl: {
                        where: {
                          language_id: language?.id
                        }
                      },
                      menu_option: {
                        include: {
                          menu_option_tl: {
                            where: {
                              language_id: language?.id
                            }
                          }
                        },
                        where: {
                          remove_at: null
                        },
                        orderBy: [{ index: 'asc' }, { id: 'asc' }]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
      return menus;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findAllAdminMenu(
    id: number,
    market_id: number,
    status: string
  ): Promise<MenuEntity[] | null> {
    try {
      const where: WhereMenuCondition = {
        menu_category_id: id,
        remove_at: null
      };
      if (status) where.status = MenuStatus[status as keyof typeof MenuStatus];

      const language = await this.prisma.language.findFirst({
        where: {
          market: {
            some: {
              id: market_id
            }
          }
        }
      });

      const entities = (await this.prisma.menu.findMany({
        where,
        orderBy: [{ index: 'asc' }, { id: 'asc' }],
        include: {
          menu_tl: {
            select: {
              id: true,
              name: true,
              content: true
            },
            where: {
              language_id: language?.id
            }
          },
          menu_category: {
            include: {
              menu_category_tl: {
                select: {
                  id: true,
                  name: true
                },
                where: {
                  language_id: language?.id
                }
              },
              market: {
                select: {
                  currency: true
                }
              }
            }
          },
          menu_on_image: {
            select: {
              image: true
            },
            orderBy: {
              id: 'asc'
            }
          },
          menu_option_category: {
            where: {
              remove_at: null
            },
            orderBy: [{ index: 'asc' }, { id: 'asc' }],
            include: {
              menu_option_category_tl: {
                select: {
                  id: true,
                  name: true
                },
                where: {
                  language_id: language?.id
                }
              },
              menu_option: {
                where: {
                  remove_at: null
                },
                include: {
                  menu_option_tl: {
                    select: {
                      id: true,
                      name: true
                    },
                    where: {
                      language_id: language?.id
                    }
                  }
                },
                orderBy: [{ index: 'asc' }, { id: 'asc' }]
              }
            }
          }
        }
      })) as unknown as MenuEntity[];
      return entities.length ? entities : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findById(admin: AdminDto, id: number): Promise<MenuEntity | null> {
    try {
      const language = await this.prisma.language.findFirst({
        where: {
          market: {
            some: {
              id: admin.market_id
            }
          }
        }
      });

      const entity = (await this.prisma.menu.findUnique({
        where: {
          id,
          remove_at: null
        },
        include: {
          menu_tl: {
            select: {
              id: true,
              name: true
            },
            where: {
              language_id: language?.id
            }
          },
          menu_category: {
            include: {
              menu_category_tl: {
                select: {
                  id: true,
                  name: true
                }
              },
              group: true,
              market: {
                include: {
                  currency: true
                }
              }
            }
          },
          menu_on_image: {
            include: {
              image: true
            }
          },
          menu_option_category: {
            where: {
              remove_at: null
            },
            include: {
              menu_option_category_tl: {
                select: {
                  id: true,
                  name: true
                },
                where: {
                  language_id: language?.id
                }
              },
              menu_option: {
                where: {
                  remove_at: null
                },
                include: {
                  menu_option_tl: {
                    select: {
                      id: true,
                      name: true
                    },
                    where: {
                      language_id: language?.id
                    }
                  }
                }
              }
            }
          }
        }
      })) as unknown as MenuEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
}
