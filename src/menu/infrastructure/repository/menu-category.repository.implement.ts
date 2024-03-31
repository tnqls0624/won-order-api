import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { TranslateGenerator } from 'libs/translate.module';
import CustomError from 'src/common/error/custom-error';
import {
  MenuCategory,
  MenuCategoryProperties
} from 'src/menu/domain/menu-category';
import { MenuCategoryFactory } from 'src/menu/domain/menu-category.factory';
import { MenuCategoryRepository } from 'src/menu/domain/menu-category.repository';
import { UpdateMenuCategoryDto } from 'src/menu/interface/dto/update-menu-category.dto';
import { MenuCategoryEntity } from '../entity/menu-category.entity';
import { InjectionToken } from '../../application/Injection-token';

export class MenuCategoryRepositoryImplement implements MenuCategoryRepository {
  private readonly logger = new Logger(MenuCategoryRepositoryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.MENU_CATEGORY_FACTORY)
    private readonly menuCategoryFactory: MenuCategoryFactory,
    @Inject('TRANSLATE_GENERATOR')
    private readonly translateGenerator: TranslateGenerator
  ) {}

  async findByCategoriesIdWithMarketId(
    id: number
  ): Promise<MenuCategoryEntity[] | null> {
    try {
      const entities = (await this.prisma.menu_category.findMany({
        where: {
          market_id: id,
          remove_at: null
        }
      })) as MenuCategoryEntity[];
      return entities ? entities : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async updateIndex(id: number, index: number): Promise<boolean> {
    try {
      (await this.prisma.menu_category.update({
        where: {
          id
        },
        data: {
          index
        }
      })) as MenuCategoryEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findMenuCategory(
    market_id: number
  ): Promise<MenuCategoryEntity[] | null> {
    try {
      const menu_categories = (await this.prisma.menu_category.findMany({
        where: {
          market_id,
          remove_at: null
        },
        include: {
          group: true
        },
        orderBy: {
          index: 'asc'
        }
      })) as MenuCategoryEntity[];
      return menu_categories;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async save(
    market_id: number,
    group_id: number,
    menu_category: MenuCategory
  ): Promise<MenuCategoryEntity | null> {
    try {
      const entity = this.modelToEntity(menu_category);
      const menu_categories = await this.prisma.menu_category.findMany({
        where: {
          market_id,
          group_id,
          remove_at: null
        },
        orderBy: {
          index: 'desc'
        }
      });
      const index = menu_categories.length ? menu_categories[0].index + 1 : 1;
      const menu_category_data = (await this.prisma.menu_category.create({
        data: {
          market_id,
          group_id,
          index,
          status: entity.status,
          name: entity.name,
          content: entity.content || ''
        }
      })) as MenuCategoryEntity;

      // menu category tl 추가 해야함
      const menu_category_name_tl = await this.translateGenerator.gcpTranslate(
        menu_category_data.name,
        market_id
      );
      menu_category_name_tl.forEach(async (obj) => {
        for (const [key, value] of Object.entries(obj)) {
          let eng_value = '';
          const is_eng = this.translateGenerator.isEnglishText(value);
          if (is_eng) {
            eng_value = this.translateGenerator.capitalizeFirstLetter(value);
          }
          await this.prisma.menu_category_tl.create({
            data: {
              menu_category_id: menu_category_data.id as number,
              language_id: Number(key),
              name: is_eng ? eng_value : value
            }
          });
        }
      });

      return menu_category_data;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.menu_category.update({
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
    id: number,
    market_id: number,
    body: UpdateMenuCategoryDto
  ): Promise<boolean> {
    try {
      (await this.prisma.menu_category.update({
        where: {
          id
        },
        data: body
      })) as MenuCategoryEntity;

      const language = await this.prisma.language.findFirst({
        where: {
          market: {
            some: {
              id: market_id
            }
          }
        }
      });
      await this.prisma.menu_category_tl.upsert({
        where: {
          menu_category_id_language_id: {
            menu_category_id: id,
            language_id: language?.id as number
          }
        },
        create: {
          menu_category_id: id,
          language_id: language?.id as number,
          name: body.name
        },
        update: {
          name: body.name
        }
      });
      // const menu_category_name_tl = await this.translateGenerator.gcpTranslate(
      //   body.name,
      //   market_id
      // );
      // const update_menu_category_tl_promises: any[] = [];
      // menu_category_name_tl.forEach(async (obj) => {
      //   for (const [key, value] of Object.entries(obj)) {
      //     let eng_value = '';
      //     const is_eng = this.translateGenerator.isEnglishText(value);
      //     if (is_eng) {
      //       eng_value = this.translateGenerator.capitalizeFirstLetter(value);
      //     }
      //     const group_tl_promise = await this.prisma.menu_category_tl.upsert({
      //       where: {
      //         menu_category_id_language_id: {
      //           menu_category_id: id,
      //           language_id: Number(key)
      //         }
      //       },
      //       update: {
      //         name: is_eng ? eng_value : value
      //       },
      //       create: {
      //         menu_category_id: id,
      //         language_id: Number(key),
      //         name: is_eng ? eng_value : value
      //       }
      //     });
      //     update_menu_category_tl_promises.push(group_tl_promise);
      //   }
      // });
      // await Promise.all(update_menu_category_tl_promises);

      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findById(id: number): Promise<MenuCategory | null> {
    try {
      const entity = (await this.prisma.menu_category.findFirst({
        where: {
          id
        }
      })) as MenuCategoryEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: MenuCategory): MenuCategoryEntity {
    const properties = JSON.parse(
      JSON.stringify(model)
    ) as MenuCategoryProperties;
    return {
      ...properties,
      create_at: new Date(),
      update_at: new Date(),
      remove_at: null
    };
  }

  private entityToModel(entity: MenuCategoryEntity): MenuCategory {
    return this.menuCategoryFactory.reconstitute({
      ...entity
    });
  }
}
