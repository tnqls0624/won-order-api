import { Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserQuery } from 'src/auth/application/query/user.query';
import { UserEntity } from '../entity/user.entity';
import { Provider } from '../../../types/login.type';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/utils/paginate/dto';
import { CursorDto } from 'src/utils/paginate/dto/cursor.dto';

interface UserWhereCondition {
  phone?: {
    startsWith: string;
  };
  nickname?: {
    startsWith: string;
  };
  remove_at: null;
}

export class UserQueryImplement implements UserQuery {
  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findAddress(user_id: string, guest_id: string): Promise<any> {
    const where_conditions: any = {
      ...(user_id && { user_id: Number(user_id) }),
      ...(guest_id && { guest_id: guest_id })
    };

    const active_address = await this.prisma.addr_list.findFirst({
      where: {
        ...where_conditions,
        is_active: true
      }
    });

    const latest_top_four_address = await this.prisma.addr_list.findMany({
      where: {
        ...where_conditions,
        ...(active_address && {
          NOT: {
            id: active_address.id
          }
        })
      },
      take: 4,
      orderBy: { update_at: 'desc' }
    });

    return [
      ...(active_address ? [active_address] : []),
      ...latest_top_four_address
    ];
  }

  async findOneByTokenAndProvider(
    token: string,
    provider: Provider
  ): Promise<UserEntity | null> {
    const entity = (await this.prisma.user.findFirst({
      where: {
        token,
        provider: provider,
        remove_at: null
      }
    })) as UserEntity;
    return entity ? entity : null;
  }

  async checkDuplicateByPhone(phone: string): Promise<UserEntity | null> {
    const entity = (await this.prisma.user.findFirst({
      where: {
        phone,
        remove_at: null
      }
    })) as UserEntity;
    return entity ? entity : null;
  }

  async checkDuplicateByNickName(nickname: string): Promise<UserEntity | null> {
    const entity = (await this.prisma.user.findFirst({
      where: {
        nickname,
        remove_at: null
      }
    })) as UserEntity;
    return entity ? entity : null;
  }

  async findById(id: number): Promise<UserEntity | null> {
    const entity = (await this.prisma.user.findFirst({
      where: {
        id,
        remove_at: null
      }
    })) as UserEntity;
    return entity ? entity : null;
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const entity = (await this.prisma.user.findFirst({
      where: {
        phone,
        remove_at: null
      }
    })) as UserEntity;
    return entity ? entity : null;
  }

  async findByPhoneWithNoRemove(phone: string): Promise<UserEntity | null> {
    const entity = (await this.prisma.user.findFirst({
      where: {
        phone
      }
    })) as UserEntity;
    return entity ? entity : null;
  }

  async login(phone: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: Number.parseInt(phone), // 에러나서 해놓음
        remove_at: null
      }
    });
    return user;
  }

  async findAll(phone: string, nickname: string) {
    const where: UserWhereCondition = {
      remove_at: null
    };

    if (nickname)
      where.nickname = {
        startsWith: nickname
      };

    if (phone)
      where.phone = {
        startsWith: phone
      };

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        password: false,
        nickname: true,
        address: true,
        create_at: true,
        update_at: true
      },
      where,
      orderBy: {
        id: 'desc'
      }
    });

    return users;
  }

  private pagedCondition(where_conditions: any, page_options: PageOptionsDto) {
    const { limit, page, cursor } = page_options;
    const cursor_flag = !page && page === undefined;

    const page_flag = !cursor_flag && page && page !== undefined;
    const skip = page_flag ? (page - 1) * limit : 0;

    const cursor_where_conditions = {
      ...where_conditions,
      ...(cursor_flag ? { id: { lt: cursor } } : {})
    };
    const cursor_conditions: any = {
      ...cursor_where_conditions,
      skip,
      take: limit
    };
    return cursor_conditions;
  }

  private performPagedQuery(
    entities: any,
    item_count: number,
    page_options: PageOptionsDto
  ) {
    if (page_options.page) {
      const pageMetaDto: PageMetaDto = new PageMetaDto({
        pageOptionsDto: page_options,
        itemCount: item_count
      });
      return new PageDto(entities, pageMetaDto);
    }
    const itemCount = item_count;

    const next_cursor =
      entities.length === +page_options.limit
        ? (entities[entities.length - 1].id as number) - 1
        : null;
    return new CursorDto(entities, next_cursor, itemCount);
  }
}
