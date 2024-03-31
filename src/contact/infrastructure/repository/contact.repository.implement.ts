import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import CustomError from '../../../common/error/custom-error';
import { InjectionToken } from '../../application/Injection-token';
import { Contact, ContactProperties } from '../../domain/contact';
import { ContactEntity } from '../entity/contact.entity';
import { ContactRepository } from '../../domain/contact.repository';
import { ContactFactory } from '../../domain/contact.factory';
import prisma from '../../../prisma/infra/prisma-client';

export class ContactRepositoryImplement implements ContactRepository {
  private readonly logger = new Logger(ContactRepositoryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.CONTACT_FACTORY)
    private readonly contactFactory: ContactFactory
  ) {}

  async save(data: Contact): Promise<ContactEntity | null> {
    try {
      const entitie = this.modelToEntity(data);
      const entity = (await this.prisma.contact.create({
        data: entitie
      })) as ContactEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async update(id: number, body: Contact): Promise<boolean> {
    try {
      const contactEntity = this.modelToEntity(body);
      (await this.prisma.contact.update({
        where: { id },
        data: {
          ...contactEntity
        }
      })) as ContactEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: Contact): ContactEntity {
    const properties = JSON.parse(JSON.stringify(model)) as ContactProperties;
    return {
      ...properties,
      create_at: properties.create_at
    };
  }

  async findById(id: number): Promise<Contact | null> {
    try {
      const entity = (await prisma.contact.findFirst({
        where: {
          id
        }
      })) as ContactEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private entityToModel(entity: ContactEntity) {
    return this.contactFactory.reconstitute({
      ...entity
    });
  }
}
