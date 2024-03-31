import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import CustomError from 'src/common/error/custom-error';
import { LogoEntity } from '../entity/logo.entity';
import { LogoRepository } from 'src/setting/domain/logo.repository';
import { LogoFactory } from 'src/setting/domain/logo.factory';
import { Logo, LogoProperties } from 'src/setting/domain/logo';
import { InjectionToken } from '../../application/Injection-token';

export class LogoRepositoryImplement implements LogoRepository {
  private readonly logger = new Logger(LogoRepositoryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.LOGO_FACTORY)
    private readonly logoFactory: LogoFactory
  ) {}

  async findByHash(hash: string): Promise<LogoEntity | null> {
    try {
      const entity = (await this.prisma.logo.findFirst({
        where: {
          hash
        }
      })) as LogoEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async save(image: Logo, group_id: number): Promise<LogoEntity | null> {
    try {
      const entitie = this.modelToEntity(image);
      const setting = await this.prisma.setting.findFirst({
        where: {
          group_id
        }
      });

      if (setting) {
        const entity = (await this.prisma.logo.upsert({
          where: {
            setting_id: setting.id
          },
          create: {
            w120: entitie.w120,
            w360: entitie.w360,
            hash: entitie.hash,
            setting_id: setting?.id as number
          },
          update: {
            w120: entitie.w120,
            w360: entitie.w360,
            hash: entitie.hash,
            setting_id: setting?.id as number
          }
        })) as LogoEntity;
        return entity ? entity : null;
      }
      return null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
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

  async findById(id: number): Promise<Logo | null> {
    try {
      const entity = (await this.prisma.logo.findUnique({
        where: {
          id
        }
      })) as LogoEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: Logo): LogoEntity {
    const properties = JSON.parse(JSON.stringify(model)) as LogoProperties;
    return {
      ...properties,
      create_at: new Date(),
      update_at: new Date()
    };
  }

  private entityToModel(entity: LogoEntity): Logo {
    return this.logoFactory.reconstitute({
      ...entity
    });
  }
}
