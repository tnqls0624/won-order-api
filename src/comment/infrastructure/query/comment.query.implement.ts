import { Inject, Logger } from '@nestjs/common';
import CustomError from 'src/common/error/custom-error';
import { PrismaClient } from '@prisma/client';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto
} from '../../../utils/paginate/dto';
import { CursorDto } from '../../../utils/paginate/dto/cursor.dto';
import { CommentQuery } from '../../application/query/comment.query';
import { FindAllCommentForUserParams } from '../../interface/param/find-all-comment-for-user.params';

type OrderByTableCondition = {
  id?: 'asc' | 'desc';
  index?: 'asc' | 'desc';
};

export class CommentQueryImplement implements CommentQuery {
  private readonly logger = new Logger(CommentQueryImplement.name);

  constructor(
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  async findByIdWithChild(id: number) {
    const entity = await this.prisma.comment.findUnique({
      where: {
        id,
        remove_at: null
      },
      include: {
        child: true
      }
    });
    return entity ? entity : null;
  }

  async findAll(
    prams: FindAllCommentForUserParams,
    user_id: number | null,
    page_options: PageOptionsDto
  ): Promise<any | null> {
    try {
      const { group_id, exclude_secret, has_reply, only_my_comment } = prams;

      const where_condition: any = {
        remove_at: null
      };

      const cursor_conditions = this.pagedCondition(
        where_condition,
        page_options
      );
      const { skip, take, ...where } = cursor_conditions;
      const orderBy: OrderByTableCondition[] = [{ id: 'desc' }];

      if (group_id) {
        where.group_id = group_id;
      }
      if (only_my_comment && user_id) {
        where.writer_id = user_id;
      }
      if (exclude_secret !== null && exclude_secret !== undefined) {
        where.is_secret = exclude_secret;
      }
      if (has_reply !== null && has_reply !== undefined) {
        where.parent_id = has_reply ? { not: null } : null;
      }
      console.log(where);
      console.log(only_my_comment);
      const [results, item_count] = await Promise.all([
        await this.prisma.comment.findMany({
          where,
          skip,
          take,
          orderBy,
          include: {
            child: true
          }
        }),
        this.prisma.comment.count({
          where
        })
      ]);

      const comments = results.map(
        ({ child, is_secret, writer_id, content, ...comment }) => {
          const has_reply = child.length > 0;
          content =
            writer_id === user_id || !is_secret ? content : '비밀글입니다';
          return { ...comment, is_secret, has_reply, content, password: null };
        }
      );

      return this.performPagedQuery(comments, item_count, page_options);
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
