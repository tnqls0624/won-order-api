import { Inject, Logger } from '@nestjs/common';
import CustomError from 'src/common/error/custom-error';
import { PrismaClient } from '@prisma/client';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto
} from '../../../utils/paginate/dto';
import { CursorDto } from '../../../utils/paginate/dto/cursor.dto';
import { ContactQuery } from '../../application/query/contact.query';
import { ContactStatus } from '../../../types/contact.type';

type OrderByTableCondition = {
  id?: 'asc' | 'desc';
};

export class ContactQueryImplement implements ContactQuery {
  private readonly logger = new Logger(ContactQueryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findById(id: number): Promise<any | null> {
    try {
      const entity = await this.prisma.contact.findFirst({
        where: {
          id,
          remove_at: null
        }
      });
      return entity ? entity : null;
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findAll(
    status: ContactStatus | null,
    page_options: PageOptionsDto
  ): Promise<any | null> {
    try {
      const where_condition: any = {
        remove_at: null
      };

      const cursor_conditions = this.pagedCondition(
        where_condition,
        page_options
      );
      const { skip, take, ...where } = cursor_conditions;
      const orderBy: OrderByTableCondition[] = [{ id: 'desc' }];
      if (status) {
        where.status = status;
      }
      const [result, item_count] = await Promise.all([
        await this.prisma.contact.findMany({
          select: {
            id: true,
            name: true,
            company: true,
            phone: true,
            email: true,
            status: true,
            create_at: true,
            update_at: true
          },
          where,
          skip,
          take,
          orderBy
        }),
        this.prisma.contact.count({
          where
        })
      ]);
      return this.performPagedQuery(result, item_count, page_options);
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
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
}
