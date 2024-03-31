import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InjectionToken } from './application/Injection-token';
import { FindDocumentQueryHandler } from './application/query/find-document.query.handler';
import { DocumentQueryImplement } from './infrastructure/query/document.query.implement';
import { DocumentController } from './interface/document.controller';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.DOCUMENT_QUERY,
    useClass: DocumentQueryImplement
  }
];

const domain = [];

const application = [FindDocumentQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [DocumentController],
  providers: [...application, ...infrastructure, ...domain],
  exports: [...infrastructure]
})
export class DocumentModule {}
