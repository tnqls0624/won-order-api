import { Inject, Logger } from '@nestjs/common';
import CustomError from 'src/common/error/custom-error';
import { NoticeQuery } from '../../application/query/notice.query';
import { PrismaClient } from '@prisma/client';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto
} from '../../../utils/paginate/dto';
import { CursorDto } from '../../../utils/paginate/dto/cursor.dto';
import { JSDOM } from 'jsdom';

type OrderByTableCondition = {
  id?: 'asc' | 'desc';
  index?: 'asc' | 'desc';
};

export class NoticeQueryImplement implements NoticeQuery {
  private readonly logger = new Logger(NoticeQueryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findById(id: number): Promise<any | null> {
    try {
      const entity = await this.prisma.notice.findFirst({
        select: {
          id: true,
          writer: true,
          title: true,
          content: true,
          is_active: true,
          create_at: true,
          update_at: true
        },
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

  async findByByIsActiveTrue(group_id: number): Promise<any[] | null> {
    try {
      const condition: any = {
        is_active: true,
        remove_at: null
      };
      const orderBy: OrderByTableCondition[] = [
        { index: 'asc' },
        { id: 'desc' }
      ];
      if (group_id) {
        condition.group_id = group_id;
      }
      return await this.prisma.notice.findMany({
        select: {
          id: true,
          title: true,
          index: true,
          group_id: true,
          content: true,
          create_at: true,
          update_at: true
        },
        where: {
          ...condition
        },
        orderBy
      });
    } catch (error) {
      this.logger.error(error);
      throw new CustomError(error);
    }
  }

  async findAll(
    group_id: number,
    market_id: number,
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
      const orderBy: OrderByTableCondition[] = [
        { index: 'asc' },
        { id: 'desc' }
      ];

      if (group_id) {
        where.group_id = group_id;
      }
      if (market_id) {
        where.group = { market_id: market_id };
      }

      const [notices, item_count] = await Promise.all([
        await this.prisma.notice.findMany({
          select: {
            id: true,
            writer: true,
            title: true,
            index: true,
            content: true,
            is_active: true,
            create_at: true,
            update_at: true,
            group: {
              select: {
                group_tl: {
                  select: {
                    id: true,
                    name: true,
                    language: {
                      select: {
                        code: true
                      }
                    }
                  }
                }
              }
            }
          },
          where,
          skip,
          take,
          orderBy
        }),
        this.prisma.notice.count({
          where
        })
      ]);
      const result = notices.map((notice) => {
        // Creating a new DOM with the content
        const dom = new JSDOM(notice.content);

        // Get the document
        const document = dom.window.document;

        // Remove all <img> elements
        Array.from(document.getElementsByTagName('img')).forEach((img) =>
          img.remove()
        );

        // Replace <p> tags with just its contents
        Array.from(document.getElementsByTagName('p')).forEach((p) => {
          p.outerHTML = p.innerHTML;
        });

        // Remove all other HTML tags
        let content = document.body.textContent || '';

        // If content is more than 30 characters, trim it
        if (content.length > 30) {
          content = content.slice(0, 30);
        }

        return {
          ...notice,
          content: content
        };
      });
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
