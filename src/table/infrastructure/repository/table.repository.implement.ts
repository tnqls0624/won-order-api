import { Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import CustomError from 'src/common/error/custom-error';
import { Table, TableProperties } from 'src/table/domain/table';
import { TableFactory } from 'src/table/domain/table.factory';
import { TableRepository } from 'src/table/domain/table.repository';
import { TableEntity } from '../entity/table.entity';
import { InjectionToken } from '../../application/Injection-token';

export class TableRepositoryImplement implements TableRepository {
  private readonly logger = new Logger(TableRepositoryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.TABLE_FACTORY)
    private readonly tableFactory: TableFactory
  ) {}

  async updateCustomQR(id: number, body: any): Promise<boolean> {
    try {
      await this.prisma.custom_qr.update({
        where: {
          id
        },
        data: body
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async customQRSave(body: any): Promise<any> {
    try {
      const entity = await this.prisma.custom_qr.create({
        data: body
      });
      return entity;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findTableByTableNum(
    group_id: number,
    table_num: string
  ): Promise<Table | null> {
    try {
      const entity = (await this.prisma.table.findFirst({
        where: {
          group_id,
          table_num
        }
      })) as TableEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findAll(group_id: number): Promise<Table[] | null> {
    try {
      const entities = (await this.prisma.table.findMany({
        where: {
          group_id,
          remove_at: null
        },
        include: {
          group: {
            include: {
              group_tl: true
            }
          }
        }
      })) as TableEntity[];
      return entities.map((entity: TableEntity) => this.entityToModel(entity));
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async save(data: Table): Promise<TableEntity | null> {
    try {
      const entitie = this.modelToEntity(data);
      const entity = (await this.prisma.table.create({
        data: entitie
      })) as TableEntity;
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findById(id: number): Promise<Table | null> {
    try {
      const entity = (await this.prisma.table.findFirst({
        where: {
          id
        },
        include: {
          group: {
            include: {
              group_tl: true
            }
          }
        }
      })) as TableEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      (await this.prisma.table.delete({
        where: { id }
      })) as TableEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async deleteCustomQR(id: number): Promise<boolean> {
    try {
      await this.prisma.custom_qr.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: Table): TableEntity {
    const properties = JSON.parse(JSON.stringify(model)) as TableProperties;
    return {
      ...properties,
      remove_at: null,
      create_at: properties.create_at
    };
  }

  private entityToModel(entity: TableEntity): Table {
    return this.tableFactory.reconstitute({
      ...entity,
      create_at: entity.create_at
    });
  }
}
