import { NoticeRepository } from '../../domain/notice.repository';
import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NoticeFactory } from '../../domain/notice.factory';
import { InjectionToken } from '../../application/Injection-token';
import { NoticeEntity } from '../entity/notice.entity';
import { Notice, NoticeProperties } from '../../domain/notice';
import CustomError from '../../../common/error/custom-error';
import prisma from '../../../prisma/infra/prisma-client';
import dayjs from 'dayjs';
import { UpdateNoticeDto } from '../../interface/dto/update-notice.dto';

export class NoticeRepositoryImplement implements NoticeRepository {
  private readonly logger = new Logger(NoticeRepositoryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.NOTICE_FACTORY)
    private readonly noticeFactory: NoticeFactory
  ) {}

  async save(data: Notice): Promise<NoticeEntity | null> {
    try {
      const entitie = this.modelToEntity(data);
      const entity = (await this.prisma.notice.create({
        data: entitie
      })) as NoticeEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      (await this.prisma.notice.update({
        where: { id },
        data: {
          remove_at: dayjs().toDate()
        }
      })) as NoticeEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findById(id: number): Promise<Notice | null> {
    try {
      const entity = (await prisma.notice.findFirst({
        where: {
          id
        }
      })) as NoticeEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: Notice): NoticeEntity {
    const properties = JSON.parse(JSON.stringify(model)) as NoticeProperties;
    return {
      ...properties,
      create_at: properties.create_at
    };
  }

  private entityToModel(entity: NoticeEntity) {
    return this.noticeFactory.reconstitute({
      ...entity
    });
  }

  async update(id: number, body: UpdateNoticeDto): Promise<boolean> {
    try {
      (await this.prisma.notice.update({
        where: { id },
        data: {
          ...body
        }
      })) as NoticeEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async updateIndex(id: number, index: number): Promise<boolean> {
    try {
      await this.prisma.notice.update({
        where: { id },
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

  async findByHash(hash: string): Promise<any> {
    try {
      const entity = await this.prisma.notice_image.findUnique({
        where: {
          hash
        }
      });
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async saveImage(body: any): Promise<any> {
    try {
      const image = await this.prisma.notice_image.create({
        data: body
      });
      return image;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
}
