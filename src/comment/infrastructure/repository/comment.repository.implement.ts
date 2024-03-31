import { CommentRepository } from '../../domain/comment.repository';
import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CommentFactory } from '../../domain/comment.factory';
import { CommentEntity } from '../entity/comment.entity';
import { Comment, CommentProperties } from '../../domain/comment';
import CustomError from '../../../common/error/custom-error';
import { InjectionToken } from '../../application/Injection-token';
import dayjs from 'dayjs';

export class CommentRepositoryImplement implements CommentRepository {
  private readonly logger = new Logger(CommentRepositoryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.COMMENT_FACTORY)
    private readonly commentFactory: CommentFactory
  ) {}

  async findById(id: number) {
    const entity = await this.prisma.comment.findUnique({
      where: {
        id,
        remove_at: null
      }
    });
    return entity ? entity : null;
  }

  async save(data: Comment): Promise<CommentEntity | null> {
    try {
      const entitie = this.modelToEntity(data);
      const entity = (await this.prisma.comment.create({
        data: entitie
      })) as CommentEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: Comment): CommentEntity {
    const properties = JSON.parse(JSON.stringify(model)) as CommentProperties;
    return {
      ...properties,
      create_at: properties.create_at
    };
  }

  async delete(id: number): Promise<boolean> {
    try {
      (await this.prisma.comment.update({
        where: { id },
        data: {
          remove_at: dayjs().toDate()
        }
      })) as CommentEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async updateContent(content: string, id: number): Promise<boolean> {
    try {
      await this.prisma.comment.update({
        where: { id },
        data: {
          content: content
        }
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private entityToModel(entity: CommentEntity) {
    return this.commentFactory.reconstitute({
      ...entity
    });
  }
}
