import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { TranslateGenerator } from 'libs/translate.module';
import CustomError from 'src/common/error/custom-error';
import { Group, GroupProperties } from 'src/group/domain/group';
import { GroupFactory } from 'src/group/domain/group.factory';
import { GroupRepository } from 'src/group/domain/group.repository';
import { GroupEntity } from '../entity/group.entity';
import { UpdateGroupTlsDto } from 'src/group/interface/dto/update-group-tl.dto';
import { InjectionToken } from 'src/group/application/injection-token';

export class GroupRepositoryImplement implements GroupRepository {
  private readonly logger = new Logger(GroupRepositoryImplement.name);

  constructor(
    @Inject(InjectionToken.GROUP_FACTORY)
    private readonly groupFactory: GroupFactory,
    @Inject('TRANSLATE_GENERATOR')
    private readonly translateGenerator: TranslateGenerator,
    @Inject('PRISMA_CLIENT') private prisma: PrismaClient
  ) {}

  async updateGroupTl(body: UpdateGroupTlsDto): Promise<boolean> {
    for (const group_tl of body.group_tls) {
      const { id, ...data } = group_tl;
      await this.prisma.group_tl.update({
        where: {
          id
        },
        data
      });
    }
    return true;
  }

  async findByName(market_id: number, name: string): Promise<Group | null> {
    try {
      const entity = (await this.prisma.group.findFirst({
        where: {
          market_id,
          name,
          remove_at: null
        }
      })) as GroupEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const groups = await this.prisma.admin_group.findMany({
        where: {
          group_id: id
        },
        select: {
          id: true
        }
      });
      const tartget_admin_groups = groups.map((v) => v.id);
      await this.prisma.$transaction(async (prisma: PrismaClient) => {
        await prisma.admin_group.deleteMany({
          where: {
            group_id: {
              in: tartget_admin_groups
            }
          }
        });
        await prisma.group.update({
          where: {
            id
          },
          data: {
            remove_at: dayjs().toDate()
          }
        });
        await prisma.setting.update({
          where: {
            group_id: id
          },
          data: {
            remove_at: dayjs().toDate()
          }
        });
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
    name: string,
    content: string
  ): Promise<boolean> {
    try {
      await this.prisma.$transaction(async (tx: PrismaClient) => {
        (await tx.group.update({
          where: { id },
          data: {
            name,
            content
          }
        })) as GroupEntity;

        const language = await this.prisma.language.findFirst({
          where: {
            market: {
              some: {
                id: market_id
              }
            }
          }
        });
        await this.prisma.group_tl.upsert({
          where: {
            group_id_language_id: {
              group_id: id,
              language_id: language?.id as number
            }
          },
          create: {
            group_id: id,
            language_id: language?.id as number,
            name
          },
          update: {
            name
          }
        });
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async select(
    admin_id: number,
    market_id: number,
    select_ids: number[]
  ): Promise<boolean> {
    try {
      await this.prisma.$transaction(async (tx: PrismaClient) => {
        const all_groups = await tx.group.findMany({
          where: {
            market_id,
            remove_at: null
          }
        });
        const existing_relations = await tx.admin_group.findMany({
          where: {
            admin_id
          }
        });
        const existing_group_ids = existing_relations.map(
          (r: { group_id: number }) => r.group_id
        );
        const operations = all_groups.map(async (group) => {
          const is_selected = select_ids.includes(group.id);
          const exists = existing_group_ids.includes(group.id);
          if (is_selected) {
            if (exists) {
              return tx.admin_group.update({
                where: {
                  admin_id_group_id: { admin_id, group_id: group.id }
                },
                data: { selected: true }
              });
            } else {
              return tx.admin_group.create({
                data: {
                  admin_id,
                  group_id: group.id,
                  selected: true
                }
              });
            }
          } else if (exists) {
            return tx.admin_group.update({
              where: {
                admin_id_group_id: { admin_id, group_id: group.id }
              },
              data: { selected: false }
            });
          }
        });
        await Promise.all(operations);
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async save(market_id: number, data: Group): Promise<GroupEntity> {
    try {
      const entity = this.modelToEntity(data);

      const group = await this.prisma.$transaction(async (tx) => {
        const group_data = (await tx.group.create({
          data: entity
        })) as GroupEntity;
        const group_name_tl = await this.translateGenerator.gcpTranslate(
          group_data.name,
          market_id
        );

        const create_group_tl_promises: any[] = [];
        group_name_tl.forEach((obj) => {
          for (const [key, value] of Object.entries(obj)) {
            let eng_value = '';
            const is_eng = this.translateGenerator.isEnglishText(value);
            if (is_eng) {
              eng_value = this.translateGenerator.capitalizeFirstLetter(value);
            }
            const group_tl_promise = tx.group_tl.create({
              data: {
                group_id: group_data.id as number,
                language_id: Number(key),
                name: is_eng ? eng_value : value
              }
            });
            create_group_tl_promises.push(group_tl_promise);
          }
        });

        await Promise.all(create_group_tl_promises);
        return group_data;
      });

      return group;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findById(id: number): Promise<Group | null> {
    try {
      const entity = (await this.prisma.group.findFirst({
        where: {
          id
        }
      })) as GroupEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findAll(market_id: number): Promise<GroupEntity[]> {
    try {
      const entities = (await this.prisma.group.findMany({
        where: {
          market_id,
          remove_at: null
        }
      })) as GroupEntity[];
      return entities;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findAllWithLanguageId(
    market_id: number,
    language_id: number
  ): Promise<GroupEntity[] | null> {
    try {
      const entities = (await this.prisma.group.findMany({
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
              language_id
            }
          }
        }
      })) as GroupEntity[];
      return entities ? entities : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: Group): GroupEntity {
    const properties = JSON.parse(JSON.stringify(model)) as GroupProperties;
    return {
      ...properties,
      create_at: properties.create_at,
      update_at: properties.update_at,
      remove_at: properties.remove_at
    };
  }

  private entityToModel(entity: GroupEntity): Group {
    return this.groupFactory.reconstitute({
      ...entity,
      create_at: entity.create_at,
      update_at: entity.update_at,
      remove_at: entity.remove_at
    });
  }
}
