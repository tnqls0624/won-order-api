import { Inject, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { TRANSLATE_GENERATOR, TranslateGenerator } from 'libs/translate.module';
import { isEqual } from 'lodash';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { Menu, MenuProperties } from 'src/menu/domain/menu';
import { MenuFactory } from 'src/menu/domain/menu.factory';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { UpdateMenuDto } from 'src/menu/interface/dto/update-menu.dto';
import { MenuEntity } from '../entity/menu.entity';
import { UpdateMenuTlsDto } from 'src/menu/interface/dto/update-menu-tl.dto';
import { UpdateMenuOptionTlsDto } from 'src/menu/interface/dto/update-menu-option-tl.dto';
import { UpdateMenuCategoryTlsDto } from 'src/menu/interface/dto/update-menu-category-tl.dto';
import { UpdateMenuOptionCategoryTlsDto } from 'src/menu/interface/dto/update-menu-option-category-tl.dto';
import { InjectionToken } from '../../application/Injection-token';

enum MenuOptionCategoryType {
  REQUIRE = 'REQUIRE',
  OPTION = 'OPTION'
}

type UpdateMenuOption = {
  name: string;
  amount: number;
};

type UpdateMenuOptionCategoryData = {
  index: number;
  type: MenuOptionCategoryType;
  name: string;
  max_select_count: number;
  menu_option: UpdateMenuOption[];
};

export class MenuRepositoryImplement implements MenuRepository {
  private readonly logger = new Logger(MenuRepositoryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.MENU_FACTOEY)
    private readonly menuFactory: MenuFactory,
    @Inject(TRANSLATE_GENERATOR)
    private readonly translateGenerator: TranslateGenerator
  ) {}

  async save(market_id: number, menu: Menu): Promise<boolean> {
    try {
      const entity = this.modelToEntity(menu);
      await this.prisma.$transaction(
        async (tx: PrismaClient) => {
          const menu_data = await tx.menu.create({
            data: {
              menu_category_id: entity.menu_category_id,
              status: entity.status,
              name: entity.name,
              content: entity.content,
              amount: entity.amount,
              is_active: entity.is_active,
              menu_on_image: {
                create: entity?.image_ids?.map((v) => {
                  return {
                    image_id: v
                  };
                })
              },
              menu_option_category: {
                create: entity.menu_option_category.map((moc) => {
                  return {
                    ...moc,
                    menu_option: {
                      create: moc.menu_option.map((mo) => {
                        return {
                          ...mo
                        };
                      })
                    }
                  };
                })
              }
            }
          });

          const menu_name_tl = await this.translateGenerator.gcpTranslate(
            menu_data.name,
            market_id
          );
          // 메뉴 내용 번역
          let menu_content_tl: any[] = [];
          if (menu_data.content) {
            menu_content_tl = await this.translateGenerator.gcpTranslate(
              menu_data.content,
              market_id
            );
          }

          // 메뉴 이름과 내용 번역 결과 처리
          for (const obj of menu_name_tl) {
            for (const [key, name_value] of Object.entries(obj)) {
              let eng_name_value = '';
              const is_eng_name =
                this.translateGenerator.isEnglishText(name_value);
              if (is_eng_name) {
                eng_name_value =
                  this.translateGenerator.capitalizeFirstLetter(name_value);
              }
              // 번역된 내용 추출
              let translated_content = '';
              const content_translation = menu_content_tl.find(
                (translation) => translation[key]
              );
              if (content_translation) {
                translated_content = content_translation[key];
              }
              await tx.menu_tl.create({
                data: {
                  menu_id: menu_data.id,
                  language_id: Number(key),
                  name: is_eng_name ? eng_name_value : name_value,
                  content: translated_content
                }
              });
            }
          }
        },
        {
          timeout: 50000,
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable
        }
      );
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async updateMenuOptionCategoryTl(
    body: UpdateMenuOptionCategoryTlsDto
  ): Promise<boolean> {
    for (const menu_option_category_tl of body.menu_option_category_tls) {
      const { id, ...data } = menu_option_category_tl;
      await this.prisma.menu_option_category_tl.update({
        where: {
          id
        },
        data
      });
    }
    return true;
  }

  async updateMenuCategoryTl(body: UpdateMenuCategoryTlsDto): Promise<boolean> {
    for (const menu_category_tl of body.menu_category_tls) {
      const { id, ...data } = menu_category_tl;
      await this.prisma.menu_category_tl.update({
        where: {
          id
        },
        data
      });
    }
    return true;
  }

  async updateMenuOptionTl(body: UpdateMenuOptionTlsDto): Promise<boolean> {
    for (const menu_option_tl of body.menu_option_tls) {
      const { id, ...data } = menu_option_tl;
      await this.prisma.menu_option_tl.update({
        where: {
          id
        },
        data
      });
    }
    return true;
  }

  async updateMenuTl(body: UpdateMenuTlsDto): Promise<boolean> {
    for (const menu_tl of body.menu_tls) {
      const { id, ...data } = menu_tl;
      await this.prisma.menu_tl.update({
        where: {
          id
        },
        data
      });
    }
    return true;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.menu.update({
        where: {
          id
        },
        data: {
          remove_at: dayjs().toDate()
        }
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async update(
    market_id: number,
    id: number,
    body: UpdateMenuDto
  ): Promise<boolean> {
    try {
      const existing_menu = await this.prisma.menu.findUnique({
        where: { id }
      });
      if (!existing_menu) throw new CustomError(RESULT_CODE.NOT_FOUND_MENU);
      const menu_updates: any = {};
      for (const [key, value] of Object.entries(body.menu)) {
        if (key !== 'image_ids' && key !== 'menu_option_category') {
          menu_updates[key] = value;
        }
      }
      const existing_menu_images = await this.prisma.menu_on_image.findMany({
        where: { menu_id: id },
        select: { id: true, image_id: true }
      });
      const existing_image_ids = existing_menu_images.map(
        (image) => image.image_id
      );

      const language = await this.prisma.language.findFirst({
        where: {
          market: {
            some: {
              id: market_id
            }
          }
        }
      });
      if (Object.keys(menu_updates).length) {
        await this.prisma.menu.update({
          where: { id },
          data: menu_updates
        });
        await this.prisma.menu_tl.update({
          where: {
            menu_id_language_id: {
              menu_id: id,
              language_id: language?.id as number
            }
          },
          data: {
            name: menu_updates.name,
            content: menu_updates.content
          }
        });

        // if (menu_updates.name) {
        //   const menu_name_tl = await this.translateGenerator.gcpTranslate(
        //     menu_updates.name,
        //     market_id
        //   );
        //   for (const obj of menu_name_tl) {
        //     for (const [key, value] of Object.entries(obj)) {
        //       let eng_value = '';
        //       const is_eng = this.translateGenerator.isEnglishText(value);
        //       if (is_eng) {
        //         eng_value =
        //           this.translateGenerator.capitalizeFirstLetter(value);
        //       }
        //       await this.prisma.menu_tl.upsert({
        //         where: {
        //           menu_id_language_id: {
        //             menu_id: existing_menu.id,
        //             language_id: Number(key)
        //           }
        //         },
        //         update: {
        //           name: is_eng ? eng_value : value
        //         },
        //         create: {
        //           menu_id: existing_menu.id,
        //           language_id: Number(key),
        //           name: is_eng ? eng_value : value,
        //           content: ''
        //         }
        //       });
        //     }
        //   }
        // }
        // // 메뉴 내용 번역 및 업데이트
        // if (menu_updates.content) {
        //   const menu_content_tl = await this.translateGenerator.gcpTranslate(
        //     menu_updates.content,
        //     market_id
        //   );
        //   for (const obj of menu_content_tl) {
        //     for (const [key, value] of Object.entries(obj)) {
        //       await this.prisma.menu_tl.update({
        //         where: {
        //           menu_id_language_id: {
        //             menu_id: existing_menu.id,
        //             language_id: Number(key)
        //           }
        //         },
        //         data: {
        //           content: value || null
        //         }
        //       });
        //     }
        //   }
        // }
      }
      await this.prisma.$transaction(
        async (tx: PrismaClient) => {
          if (
            body.menu.image_ids &&
            !isEqual(existing_image_ids.sort(), body.menu.image_ids.sort())
          ) {
            await this.updateMenuImages(
              id,
              body.menu.image_ids,
              existing_menu_images,
              tx
            );
          }
          await this.updateMenuOptionCategoriesAndOptions(
            id,
            market_id,
            body.menu.menu_option_category,
            language?.id as number,
            tx
          );
        },
        {
          timeout: 50000,
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable
        }
      );
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private async updateMenuOptionCategoriesAndOptions(
    menu_id: number,
    market_id: number,
    menu_option_categories: UpdateMenuOptionCategoryData[],
    language_id: number,
    tx: PrismaClient
  ): Promise<void> {
    // 기존 메뉴 옵션 카테고리 이름들
    const existing_category_names = await tx.menu_option_category
      .findMany({
        where: { menu_id, remove_at: null },
        select: { name: true }
      })
      .then((categories) => categories.map((category) => category.name));

    for (const category of menu_option_categories) {
      // 클라이언트가 입력한 카테고리가 기존 데이터인지 확인
      const existing_category = await tx.menu_option_category.findFirst({
        where: { menu_id, name: category.name, remove_at: null }
      });

      if (existing_category) {
        const index = existing_category_names.indexOf(category.name);
        if (index > -1) existing_category_names.splice(index, 1); // 유저가 보낸데이터에 이름 있으면 삭제할 항목 existing_category_names에서 해당 카테고리 삭제
        const { menu_option: menu_options, ...menu_option_category } = category;
        await tx.menu_option_category.upsert({
          where: { id: existing_category.id, remove_at: null },
          create: {
            menu_id,
            index: menu_option_category.index,
            type: menu_option_category.type,
            name: menu_option_category.name,
            max_select_count: menu_option_category.max_select_count
          },
          update: {
            index: menu_option_category.index,
            type: menu_option_category.type,
            name: menu_option_category.name,
            max_select_count: menu_option_category.max_select_count
          }
        });

        await tx.menu_option_category_tl.upsert({
          where: {
            menu_option_category_id_language_id: {
              menu_option_category_id: existing_category.id,
              language_id
            }
          },
          create: {
            menu_option_category_id: existing_category.id,
            language_id,
            name: menu_option_category.name
          },
          update: {
            name: menu_option_category.name
          }
        });
        // const menu_option_category_name_tl =
        //   await this.translateGenerator.gcpTranslate(
        //     menu_option_category.name,
        //     market_id
        //   );
        // for (const obj of menu_option_category_name_tl) {
        //   for (const [key, value] of Object.entries(obj)) {
        //     let eng_value = '';
        //     const is_eng = this.translateGenerator.isEnglishText(value);
        //     if (is_eng) {
        //       eng_value = this.translateGenerator.capitalizeFirstLetter(value);
        //     }
        //     await tx.menu_option_category_tl.upsert({
        //       where: {
        //         menu_option_category_id_language_id: {
        //           menu_option_category_id: existing_category.id,
        //           language_id: Number(key)
        //         }
        //       },
        //       update: {
        //         name: is_eng ? eng_value : value
        //       },
        //       create: {
        //         menu_option_category_id: existing_category.id,
        //         language_id: Number(key),
        //         name: is_eng ? eng_value : value
        //       }
        //     });
        //   }
        // }
        await this.updateMenuOptions(
          menu_options,
          market_id,
          existing_category.id,
          language_id,
          tx
        );
      } else {
        // 새로운 옵션 생성
        const new_category = await tx.menu_option_category.upsert({
          where: {
            name_menu_id: {
              name: category.name,
              menu_id
            }
          },
          create: {
            index: category.index,
            type: category.type,
            name: category.name,
            max_select_count: category.max_select_count,
            menu_id
          },
          update: {
            index: category.index,
            type: category.type,
            name: category.name,
            max_select_count: category.max_select_count
          }
        });
        // await tx.menu_option_category_tl.upsert({
        //   where: {
        //     menu_option_category_id_language_id: {
        //       menu_option_category_id: new_category.id,
        //       language_id
        //     }
        //   },
        //   create: {
        //     menu_option_category_id: new_category.id,
        //     language_id,
        //     name: category.name,
        //   },
        //   update: {
        //     name: category.name,
        //   }
        // });

        const menu_option_category_name_tl =
          await this.translateGenerator.gcpTranslate(
            new_category.name,
            market_id
          );
        for (const obj of menu_option_category_name_tl) {
          for (const [key, value] of Object.entries(obj)) {
            let eng_value = '';
            const is_eng = this.translateGenerator.isEnglishText(value);
            if (is_eng) {
              eng_value = this.translateGenerator.capitalizeFirstLetter(value);
            }
            await tx.menu_option_category_tl.upsert({
              where: {
                menu_option_category_id_language_id: {
                  menu_option_category_id: new_category.id,
                  language_id: Number(key)
                }
              },
              create: {
                menu_option_category_id: new_category.id,
                language_id: Number(key),
                name: is_eng ? eng_value : value
              },
              update: {
                menu_option_category_id: new_category.id,
                language_id: Number(key),
                name: is_eng ? eng_value : value,
                remove_at: null
              }
            });
          }
        }
        for (const option of category.menu_option) {
          const menu_option = await tx.menu_option.upsert({
            where: {
              name_menu_option_category_id: {
                name: option.name,
                menu_option_category_id: new_category.id
              }
            },
            create: {
              ...option,
              menu_option_category_id: new_category.id
            },
            update: {
              ...option
            }
          });
          // await tx.menu_option_tl.upsert({
          //   where: {
          //     menu_option_id_language_id: {
          //       menu_option_id: new_category.id,
          //       language_id
          //     }
          //   },
          //   create: {
          //     menu_option_id: new_category.id,
          //     language_id,
          //     name: category.name,
          //   },
          //   update: {
          //     name: category.name,
          //   }
          // });
          const menu_option_name_tl =
            await this.translateGenerator.gcpTranslate(
              menu_option.name,
              market_id
            );
          for (const obj of menu_option_name_tl) {
            for (const [key, value] of Object.entries(obj)) {
              let eng_value = '';
              const is_eng = this.translateGenerator.isEnglishText(value);
              if (is_eng) {
                eng_value =
                  this.translateGenerator.capitalizeFirstLetter(value);
              }
              await tx.menu_option_tl.upsert({
                where: {
                  menu_option_id_language_id: {
                    menu_option_id: menu_option.id,
                    language_id: Number(key)
                  }
                },
                create: {
                  menu_option_id: menu_option.id,
                  language_id: Number(key),
                  name: is_eng ? eng_value : value
                },
                update: {
                  menu_option_id: menu_option.id,
                  language_id: Number(key),
                  name: is_eng ? eng_value : value,
                  remove_at: null
                }
              });
            }
          }
        }
      }
    }

    // 카테고리 항목 삭제
    for (const category_name of existing_category_names) {
      await tx.menu_option_category.update({
        where: {
          name_menu_id: {
            menu_id: menu_id,
            name: category_name
          }
        },
        data: {
          remove_at: dayjs().toDate()
        }
      });
    }
  }

  private async updateMenuOptions(
    menu_options: UpdateMenuOption[],
    market_id: number,
    menu_option_category_id: number,
    language_id: number,
    tx: PrismaClient
  ): Promise<void> {
    const existing_option_names = await tx.menu_option
      .findMany({
        where: { menu_option_category_id, remove_at: null },
        select: { name: true }
      })
      .then((options) => options.map((option) => option.name));

    for (const option of menu_options) {
      const existing_option = await tx.menu_option.findFirst({
        where: { menu_option_category_id, name: option.name, remove_at: null }
      });
      if (existing_option) {
        const index = existing_option_names.indexOf(option.name);
        if (index > -1) existing_option_names.splice(index, 1); // 목록에서 옵션 제거
        await tx.menu_option.upsert({
          where: { id: existing_option.id },
          create: {
            menu_option_category_id,
            amount: option.amount,
            name: option.name
          },
          update: { amount: option.amount, name: option.name }
        });
        await tx.menu_option_tl.upsert({
          where: {
            menu_option_id_language_id: {
              menu_option_id: existing_option.id,
              language_id
            }
          },
          create: {
            menu_option_id: existing_option.id,
            language_id,
            name: option.name
          },
          update: {
            name: option.name
          }
        });

        // const menu_option_name_tl = await this.translateGenerator.gcpTranslate(
        //   option.name,
        //   market_id
        // );
        //
        // for (const obj of menu_option_name_tl) {
        //   for (const [key, value] of Object.entries(obj)) {
        //     let eng_value = '';
        //     const is_eng = this.translateGenerator.isEnglishText(value);
        //     if (is_eng) {
        //       eng_value = this.translateGenerator.capitalizeFirstLetter(value);
        //     }
        //     await tx.menu_option_tl.upsert({
        //       where: {
        //         menu_option_id_language_id: {
        //           menu_option_id: existing_option.id,
        //           language_id: Number(key)
        //         }
        //       },
        //       update: {
        //         name: is_eng ? eng_value : value
        //       },
        //       create: {
        //         menu_option_id: existing_option.id,
        //         language_id: Number(key),
        //         name: is_eng ? eng_value : value
        //       }
        //     });
        //   }
        // }
      } else {
        const menu_option = await tx.menu_option.create({
          data: {
            amount: option.amount,
            name: option.name,
            menu_option_category_id
          }
        });
        // await tx.menu_option_tl.upsert({
        //   where: {
        //     menu_option_id_language_id: {
        //       menu_option_id: menu_option.id,
        //       language_id
        //     }
        //   },
        //   create: {
        //     menu_option_id: menu_option.id,
        //     language_id,
        //     name: option.name,
        //   },
        //   update: {
        //     name: option.name,
        //   }
        // });
        const menu_option_name_tl = await this.translateGenerator.gcpTranslate(
          option.name,
          market_id
        );
        for (const obj of menu_option_name_tl) {
          for (const [key, value] of Object.entries(obj)) {
            let eng_value = '';
            const is_eng = this.translateGenerator.isEnglishText(value);
            if (is_eng) {
              eng_value = this.translateGenerator.capitalizeFirstLetter(value);
            }
            await tx.menu_option_tl.create({
              data: {
                menu_option_id: menu_option.id,
                language_id: Number(key),
                name: is_eng ? eng_value : value
              }
            });
          }
        }
      }
    }

    // 카테고리에 대한 입력에 없는 옵션 삭제
    for (const option_name of existing_option_names) {
      await tx.menu_option.update({
        where: {
          name_menu_option_category_id: {
            menu_option_category_id,
            name: option_name
          }
        },
        data: {
          remove_at: dayjs().toDate()
        }
      });
    }
  }

  private async updateMenuImages(
    menu_id: number,
    image_ids: number[],
    existing_images: {
      id: number;
      image_id: number;
    }[],
    tx: PrismaClient
  ): Promise<void> {
    const existing_image_ids = existing_images.map((image) => image.image_id);
    const image_id_to_association_id = existing_images.reduce((acc, image) => {
      acc[image.image_id] = image.id;
      return acc;
    }, {});

    const images_to_add = image_ids.filter(
      (id) => !existing_image_ids.includes(id)
    );
    const images_to_remove = existing_image_ids.filter(
      (id) => !image_ids.includes(id)
    );

    for (const image_id of images_to_add) {
      await tx.menu_on_image.create({
        data: {
          menu_id,
          image_id
        }
      });
    }

    for (const image_id of images_to_remove) {
      const association_id_to_remove = image_id_to_association_id[image_id];
      if (association_id_to_remove) {
        await tx.menu_on_image.delete({
          where: {
            id: association_id_to_remove
          }
        });
      }
    }
  }

  async updateIndex(id: number, index: number): Promise<boolean> {
    try {
      await this.prisma.menu.update({
        where: {
          id
        },
        data: {
          index
        }
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findById(id: number): Promise<Menu | null> {
    try {
      const entity = (await this.prisma.menu.findFirst({
        where: {
          id
        }
      })) as unknown as MenuEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(`Error finding menu by id ${id}: ${error.message}`);
      throw new CustomError(RESULT_CODE.SELECT_ERROR);
    }
  }

  private modelToEntity(model: Menu): MenuEntity {
    const properties = JSON.parse(JSON.stringify(model)) as MenuProperties;
    return {
      ...properties,
      create_at: new Date(),
      remove_at: null,
      update_at: new Date()
    };
  }

  private entityToModel(entity: MenuEntity): Menu {
    return this.menuFactory.reconstitute({
      ...entity
    });
  }
}
