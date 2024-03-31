import { Inject, Logger } from '@nestjs/common';
import { PrismaClient, VerificationType } from '@prisma/client';
import CustomError from 'src/common/error/custom-error';
import {
  Verification,
  VerificationProperties
} from 'src/verification/domain/verification';
import { VerificationFactory } from 'src/verification/domain/verification.factory';
import { VerificationRepository } from 'src/verification/domain/verification.repository';
import { VerificationEntity } from '../entity/verification.entity';

export class VerificationRepositoryImplement implements VerificationRepository {
  @Inject() private readonly verificationFactory: VerificationFactory;
  private readonly logger = new Logger(VerificationRepositoryImplement.name);
  constructor(@Inject('PRISMA_CLIENT') private prisma: PrismaClient) {}
  async findByAll(
    type: VerificationType,
    phone: string,
    token: string,
    code: string
  ): Promise<Verification | null> {
    try {
      const entity = (await this.prisma.verification.findFirst({
        where: {
          type,
          phone,
          token,
          code
        }
      })) as VerificationEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async save(data: Verification): Promise<VerificationEntity | null> {
    try {
      const entitie = this.modelToEntity(data);
      const entity = (await this.prisma.verification.create({
        data: entitie
      })) as VerificationEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }
  async update(id: number, token: string, code: string): Promise<boolean> {
    try {
      (await this.prisma.verification.update({
        where: {
          id
        },
        data: {
          token,
          code
        }
      })) as VerificationEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findByPhoneWithType(
    type: VerificationType,
    phone: string
  ): Promise<Verification | null> {
    try {
      const entity = (await this.prisma.verification.findFirst({
        where: {
          type,
          phone
        }
      })) as VerificationEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findById(id: number): Promise<Verification | null> {
    try {
      const entity = (await this.prisma.verification.findFirst({
        where: {
          id
        }
      })) as VerificationEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async find(phone: string, code: string): Promise<Verification | null> {
    try {
      const entity = (await this.prisma.verification.findFirst({
        where: {
          phone,
          code
        }
      })) as VerificationEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      (await this.prisma.verification.delete({
        where: { id }
      })) as VerificationEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: Verification): VerificationEntity {
    const properties = JSON.parse(
      JSON.stringify(model)
    ) as VerificationProperties;
    return {
      ...properties,
      create_at: properties.create_at
    };
  }

  private entityToModel(entity: VerificationEntity): Verification {
    return this.verificationFactory.reconstitute({
      ...entity,
      create_at: entity.create_at
    });
  }
}
