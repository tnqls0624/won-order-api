import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/auth/auth.module';
import { CreateTableCommandHandler } from './application/command/create-table.command.handler';
import { DeleteTableCommandHandler } from './application/command/delete-table.command.handler';
import { TableController } from './interface/table.controller';
import { CreateQRCodeQueryHandler } from './application/query/create-qr-code.query.handler';
import { FindAllTableQueryHandler } from './application/query/find-all-table.query.handler';
import { InjectionToken } from './application/Injection-token';
import { TableRepositoryImplement } from './infrastructure/repository/table.repository.implement';
import { TableFactory } from './domain/table.factory';
import { TableDomainService } from './domain/table.domain.service';
import { TableQueryImplement } from './infrastructure/query/table.query.implement';
import { DeleteTableHandler } from './application/event/delete-table.handler';
import { FindAllTableForEmployeeQueryHandler } from './application/query/find-all-table-for-employee.query.handler';
import { CreateCustomQRCommandHandler } from './application/command/create-custom-qr.command.handler';
import { FindAllCustomQRQueryHandler } from './application/query/find-all-custom-qr.query.handler';
import { FindCustomQRQueryHandler } from './application/query/find-custom-qr.query.handler';
import { DeleteCustomQRCommandHandler } from './application/command/delete-custom-qr.command.handler';
import { CreateCustomQRQueryHandler } from './application/query/create-custom-qr.query.handler';
import { UpdateCustomQRCommandHandler } from './application/command/update-custom-qr.command.handler';
import { FindTableQueryHandler } from './application/query/find-table.query.handler';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.TABLE_REPOSITORY,
    useClass: TableRepositoryImplement
  },
  {
    provide: InjectionToken.TABLE_QUERY,
    useClass: TableQueryImplement
  },
  {
    provide: InjectionToken.TABLE_FACTORY,
    useClass: TableFactory
  }
];

const domain = [TableDomainService, TableFactory];

const application = [
  CreateTableCommandHandler,
  DeleteTableCommandHandler,
  FindAllTableQueryHandler,
  CreateQRCodeQueryHandler,
  DeleteTableHandler,
  FindAllTableForEmployeeQueryHandler,
  CreateCustomQRCommandHandler,
  FindAllCustomQRQueryHandler,
  FindCustomQRQueryHandler,
  DeleteCustomQRCommandHandler,
  CreateCustomQRQueryHandler,
  UpdateCustomQRCommandHandler,
  FindTableQueryHandler,
];

@Module({
  imports: [CqrsModule, AuthModule],
  controllers: [TableController],
  providers: [...application, ...infrastructure, ...domain],
  exports: [...infrastructure, ...domain]
})
export class TableModule {}
