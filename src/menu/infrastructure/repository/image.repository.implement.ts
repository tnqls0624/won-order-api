import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import CustomError from 'src/common/error/custom-error';
import { ImageFactory } from 'src/menu/domain/image.factory';
import { ImageRepository } from 'src/menu/domain/image.repository';
import { Image, ImageProperties } from '../../domain/image';
import { ImageEntity } from '../entity/image.entity';
import { InjectionToken } from '../../application/Injection-token';

export class ImageRepositoryImplement implements ImageRepository {
  private readonly logger = new Logger(ImageRepositoryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.IMAGE_FACTORY)
    private readonly imageFactory: ImageFactory
  ) {}

  async findByHash(hash: string): Promise<ImageEntity | null> {
    try {
      const entity = (await this.prisma.image.findUnique({
        where: {
          hash
        }
      })) as ImageEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async save(image: Image): Promise<ImageEntity | null> {
    try {
      const entitie = this.modelToEntity(image);
      const entity = (await this.prisma.image.create({
        data: entitie
      })) as ImageEntity;
      return entity ? entity : null;
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

  async findById(id: number): Promise<Image | null> {
    try {
      const entity = (await this.prisma.image.findUnique({
        where: {
          id
        }
      })) as ImageEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: Image): ImageEntity {
    const properties = JSON.parse(JSON.stringify(model)) as ImageProperties;
    return {
      ...properties,
      create_at: new Date(),
      update_at: new Date()
    };
  }

  private entityToModel(entity: ImageEntity): Image {
    return this.imageFactory.reconstitute({
      ...entity
    });
  }
}
