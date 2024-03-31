import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import CustomError from 'src/common/error/custom-error';
import { Push, PushProperties } from 'src/push/domain/push';
import { PushFactory } from 'src/push/domain/push.factory';
import { PushRepository } from 'src/push/domain/push.repository';
import { PushEntity } from '../entity/push.entity';
import { InjectionToken } from '../../application/Injection-token';

export class PushRepositoryImplement implements PushRepository {
  private readonly logger = new Logger(PushRepositoryImplement.name);
  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.PUSH_FACTORY)
    private readonly pushFactory: PushFactory
  ) {}

  async findAll(user_ids: number[]): Promise<string[]> {
    try {
      const tokens = await this.prisma.push
        .findMany({
          where: {
            user_id: {
              in: user_ids
            }
          }
        })
        .then((v) => v.map((v) => v.token));
      return tokens;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async update(id: number, token: string): Promise<boolean> {
    try {
      await this.prisma.push.update({
        where: {
          id
        },
        data: {
          token
        }
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async save(push: Push): Promise<PushEntity | null> {
    try {
      const entity = this.modelToEntity(push);

      await this.prisma.push.deleteMany({
        where: {
          user_id: entity.user_id
        }
      });

      const exist_serial_push = await this.findBySerial(entity.serial);
      if (exist_serial_push) {
        await this.prisma.push.deleteMany({
          where: {
            serial: entity.serial
          }
        });
      }

      const result = (await this.prisma.push.create({
        data: entity
      })) as PushEntity;
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.push.deleteMany({
        where: {
          id
        }
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findByUserId(user_id: number): Promise<PushEntity | null> {
    try {
      const entity = (await this.prisma.push.findFirst({
        where: {
          user_id
        }
      })) as PushEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findBySerial(serial: string): Promise<PushEntity | null> {
    try {
      const entity = (await this.prisma.push.findFirst({
        where: {
          serial
        }
      })) as PushEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: Push): PushEntity {
    const properties = JSON.parse(JSON.stringify(model)) as PushProperties;
    return {
      ...properties,
      create_at: new Date(),
      update_at: new Date()
    };
  }

  private entityToModel(entity: PushEntity): Push {
    return this.pushFactory.reconstitute({
      ...entity
    });
  }
}
