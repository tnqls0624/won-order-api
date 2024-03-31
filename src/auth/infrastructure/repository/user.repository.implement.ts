import { Inject, Logger } from '@nestjs/common';
import { User, UserProperties } from 'src/auth/domain/user';
import { UserFactory } from 'src/auth/domain/user.factory';
import { UserRepository } from 'src/auth/domain/user.repository';
import CustomError from 'src/common/error/custom-error';
import { UserEntity } from '../entity/user.entity';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { UpdateAuthDto } from 'src/auth/interface/dto/req/update-auth.dto';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { RESULT_CODE } from '../../../constant';
import { UpdateAddressDto } from 'src/auth/interface/dto/req/update-address.dto';
import { AddrListEntity } from '../entity/addr_list.entity';

export class UserRepositoryImplement implements UserRepository {
  private readonly logger = new Logger(UserRepositoryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient,
    @Inject(InjectionToken.USER_FACTORY)
    private readonly userFactory: UserFactory
  ) {}

  async findAddress(id: number): Promise<AddrListEntity | null> {
    const address = (await this.prisma.addr_list.findFirst({
      where: {
        id
      }
    })) as AddrListEntity;
    return address;
  }

  async updateAddress(id: number, body: UpdateAddressDto): Promise<boolean> {
    await this.prisma.addr_list.update({
      where: {
        id
      },
      data: body
    });
    return true;
  }

  async deleteAddress(id: number): Promise<boolean> {
    await this.prisma.addr_list.delete({
      where: {
        id
      }
    });
    return true;
  }

  async recovery(id: number): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: {
          id
        },
        data: {
          remove_at: null
        }
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async saveEntity(data: User): Promise<UserEntity | null> {
    try {
      const entitie = this.modelToEntity(data);
      const entity = (await this.prisma.user.create({
        data: entitie
      })) as UserEntity;
      return entity;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const entity = (await this.prisma.user.findFirst({
        where: {
          id
        }
      })) as UserEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findByPhone(phone: string): Promise<User | null> {
    try {
      const entity = (await this.prisma.user.findFirst({
        where: {
          phone
        }
      })) as UserEntity;
      return entity ? this.entityToModel(entity) : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async updatePassword(id: number, password: string) {
    try {
      (await this.prisma.user.update({
        where: { id },
        data: {
          password
        }
      })) as UserEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async update(id: number, body: UpdateAuthDto) {
    try {
      (await this.prisma.user.update({
        where: { id },
        data: body
      })) as UserEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      (await this.prisma.user.update({
        where: { id },
        data: {
          remove_at: dayjs().toDate()
        }
      })) as UserEntity;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async validateUser(token: string): Promise<{
    id: number;
    token: string | null;
    phone: string | null;
    provider: string | null;
    nickname: string | null;
    address: string | null;
    remove_at: Date | null;
    create_at: Date;
    update_at: Date;
  } | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          token
        }
      });
      if (!user) throw new CustomError(RESULT_CODE.NOT_FOUND_USER);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...withOutPassword } = user;
      return withOutPassword;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  private modelToEntity(model: User): UserEntity {
    const properties = JSON.parse(JSON.stringify(model)) as UserProperties;
    return {
      ...properties,
      create_at: properties.create_at,
      update_at: properties.update_at,
      remove_at: null
    };
  }

  private entityToModel(entity: UserEntity): User {
    return this.userFactory.reconstitute({
      ...entity,
      create_at: entity.create_at,
      update_at: entity.update_at,
      remove_at: entity.remove_at
    });
  }
}
