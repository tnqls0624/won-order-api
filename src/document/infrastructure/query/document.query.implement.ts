import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import CustomError from 'src/common/error/custom-error';
import { DocumentQuery } from 'src/document/application/query/document.query';
import { DocumentEntity } from '../entity/document.entity';

export class DocumentQueryImplement implements DocumentQuery {
  private readonly logger = new Logger(DocumentQueryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findById(id: number): Promise<DocumentEntity | null> {
    try {
      const entity = (await this.prisma.document.findUnique({
        where: {
          id
        }
      })) as DocumentEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
}
