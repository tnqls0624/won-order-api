import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/response/response.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { CreateContactCommand } from '../application/command/create-contact.command';
import { User } from '../../common/decorators/user.decorator';
import { AdminDto } from '../../auth/interface/dto/model/admin.dto';
import { ReplyContactDto } from './dto/reply-contact.dto';
import { ReplyContactCommand } from '../application/command/reply-contact.command';
import { JwtAuthGuard } from '../../auth/guard';
import { FindContactQuery } from '../application/query/find-contact-query';
import { ContactStatus } from '../../types/contact.type';
import { FindAllContactQuery } from '../application/query/find-all-contact.query';
import { PaginateParsePipe } from '../../utils/pipe';
import { PageOptionsDto } from '../../utils/paginate/dto';
import CustomError from '../../common/error/custom-error';
import { RESULT_CODE } from '../../constant';

@ApiTags('CONTACT')
@Controller('contact')
export class ContactController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '문의글 생성 (비회원)' })
  @Post('/')
  async createContact(@Body() body: CreateContactDto) {
    return this.commandBus.execute(new CreateContactCommand(body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '문의글 아이디',
    type: 'string'
  })
  @ApiOperation({ summary: '답글 작성 (어드민)' })
  @Post('/:id')
  async replyContact(
    @Param('id', ParseIntPipe) id: number,
    @User() admin: AdminDto,
    @Body() body: ReplyContactDto
  ) {
    return this.commandBus.execute(new ReplyContactCommand(id, body, admin));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '문의글 아이디',
    type: 'string'
  })
  @ApiOperation({ summary: '문의글 상세조회 (어드민)' })
  @Get('/:id')
  async findContact(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new FindContactQuery(id));
  }

  @ApiQuery({
    name: 'status',
    required: false,
    description: '상태 (WAIT, COMPLETE)',
    type: 'string'
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '문의글 리스트 조회 (어드민)' })
  @Get('/')
  async findAllContact(
    @Query('status') status: string,
    @Query(new PaginateParsePipe()) page_options: PageOptionsDto
  ) {
    return this.queryBus.execute(
      new FindAllContactQuery(this.stringToContactStatus(status), page_options)
    );
  }

  private stringToContactStatus = (i: string) => {
    if (!i) {
      return null;
    }
    if (i === 'WAIT') {
      return ContactStatus.WAIT;
    }
    if (i === 'COMPLETE') {
      return ContactStatus.COMPLETE;
    }
    throw new CustomError(RESULT_CODE.INVALID_PARAMETER);
  };
}
