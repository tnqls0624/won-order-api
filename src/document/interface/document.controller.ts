import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/response/response.dto';
import { FindDocumentQuery } from '../application/query/find-document.query';

@ApiTags('DOCUMENT')
@Controller('document')
export class DocumentController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '문서 찾기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '문서 아이디',
    type: 'string'
  })
  @Get('/find/:id')
  async findDocument(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new FindDocumentQuery(id));
  }
}
