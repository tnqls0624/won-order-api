import { Inject, Logger } from '@nestjs/common';
import { $Enums, PrismaClient } from '@prisma/client';
import CustomError from 'src/common/error/custom-error';
import { Setting, SettingProperties } from 'src/setting/domain/setting';
import { SettingFactory } from 'src/setting/domain/setting.factory';
import { SettingRepository } from 'src/setting/domain/setting.repository';
import { UpdateSettingDto } from 'src/setting/interface/dto/update-setting.dto';
import { SettingEntity } from '../entity/setting.entity';
import { InjectionToken } from '../../application/Injection-token';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';

export class SettingRepositoryImplement implements SettingRepository {
  private readonly logger = new Logger(SettingRepositoryImplement.name);
  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.SETTING_FACTORY)
    private readonly settingFactory: SettingFactory
  ) {}

  async save(setting: Setting): Promise<SettingEntity | null> {
    try {
      const entitie = this.modelToEntity(setting);
      const entity = (await this.prisma.setting.create({
        data: entitie
      })) as SettingEntity;
      return entity;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async update(
    id: number,
    admin: AdminDto,
    market_id: number,
    settings_update_dto: UpdateSettingDto
  ): Promise<boolean> {
    try {
      const {
        currency_code,
        language,
        ...settings_data_without_currency_and_language
      } = settings_update_dto;

      if (currency_code) {
        const currency_entity = await this.findCurrencyEntity(currency_code);
        await this.prisma.market.update({
          where: {
            id: market_id
          },
          data: {
            currency_id: currency_entity?.id
          }
        });
      }

      if (language) {
        const language_entity = await this.findLanguageEntity(language);
        await this.prisma.market.update({
          where: {
            id: market_id
          },
          data: {
            language_id: language_entity?.id
          }
        });
        await this.prisma.admin.update({
          where: {
            id: admin.id
          },
          data: {
            language_id: language_entity?.id
          }
        });
      }

      (await this.prisma.setting.update({
        where: { id },
        data: {
          ...settings_data_without_currency_and_language
        }
      })) as SettingEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private async findCurrencyEntity(
    currency_code: $Enums.Currency | undefined
  ): Promise<{ id: number; code: $Enums.Currency } | null> {
    if (currency_code) {
      return this.prisma.currency.findFirst({ where: { code: currency_code } });
    }
    return null;
  }

  private async findLanguageEntity(
    language: $Enums.Language | undefined
  ): Promise<{ id: number; code: $Enums.Language } | null> {
    if (language) {
      return this.prisma.language.findFirst({ where: { code: language } });
    }
    return null;
  }

  async findById(id: number): Promise<Setting | null> {
    const entity = (await this.prisma.setting.findFirst({
      where: {
        id
      }
    })) as SettingEntity;
    return entity ? this.entityToModel(entity) : null;
  }

  private modelToEntity(model: Setting): SettingEntity {
    const properties = JSON.parse(JSON.stringify(model)) as SettingProperties;
    return {
      ...properties,
      create_at: properties.create_at
    };
  }

  private entityToModel(entity: SettingEntity): Setting {
    return this.settingFactory.reconstitute({
      ...entity
    });
  }
}
