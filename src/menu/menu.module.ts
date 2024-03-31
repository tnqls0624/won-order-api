import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/auth/auth.module';
import { CreateMenuCategoryCommandHandler } from './application/command/create-menu-category.command.handler';
import { CreateMenuCommandHandler } from './application/command/create-menu.command.handler';
import { DeleteMenuCategoryCommandHandler } from './application/command/delete-menu-category.command.handler';
import { DeleteMenuCommandHandler } from './application/command/delete-menu.command.handler';
import { UpdateMenuCategoryCommandHandler } from './application/command/update-menu-category.command.handler';
import { UpdateMenuCommandHandler } from './application/command/update-menu.command.handler';
import { UploadMenuImageCommandHandler } from './application/command/upload-menu-image.command.handler';
import { MenuController } from './interface/menu.controller';
import { FindAllMenuCategoryQueryHandler } from './application/query/find-all-menu-category.query.handler';
import { FindAllMenuQueryHandler } from './application/query/find-all-menu.query.handler';
import { FindAllUserMenuQueryHandler } from './application/query/find-all-user-menu.query.handler';
import { FindMenuCategoryQueryHandler } from './application/query/find-menu-category.query.handler';
import { FindMenuQueryHandler } from './application/query/find-menu.query.handler';
import { InjectionToken } from './application/Injection-token';
import { MenuRepositoryImplement } from './infrastructure/repository/menu.repository.implement';
import { MenuFactory } from './domain/menu.factory';
import { MenuDomainService } from './domain/menu.domain.service';
import { MenuCategoryRepositoryImplement } from './infrastructure/repository/menu-category.repository.implement';
import { MenuCategoryFactory } from './domain/menu-category.factory';
import { UpdateMenuCategoryEventHandler } from './application/event/update-menu-category.handler';
import { UpdateMenuEventHandler } from './application/event/update-menu.handler';
import { ImageRepositoryImplement } from './infrastructure/repository/image.repository.implement';
import { ImageFactory } from './domain/image.factory';
import { MenuQueryImplement } from './infrastructure/query/menu.query.implement';
import { MenuCategoryQueryImplement } from './infrastructure/query/menu-category.query.implement';
import { DeleteMenuEventHandler } from './application/event/delete-menu.handler';
import { DeleteMenuCategoryEventHandler } from './application/event/delete-menu-category.handler';
import { UpdateMenuCategoryIndexCommandHandler } from './application/command/update-menu-category-index.command.handler';
import { UpdateMenuCategoryIndexEventHandler } from './application/event/update-menu-category-index.handler';
import { CacheStoreModule } from 'src/cache/cache.module';
import { ValidationModule } from 'libs/order-validation.module';
import { TranslateModule } from 'libs/translate.module';
import { UpdateMenuIndexCommandHandler } from './application/command/update-menu-index.command.handler';
import { UpdateMenuIndexEventEventHandler } from './application/event/update-menu-index.handler';
import { FindMenuTlQueryHandler } from './application/query/find-menu-tl.query.handler';
import { UpdateMenuTlCommandHandler } from './application/command/update-menu-tl.command.handler';
import { FindMenuOptionTlQueryHandler } from './application/query/find-menu-option-tl.query.handler';
import { UpdateMenuOptionTlCommandHandler } from './application/command/update-menu-option-tl.command.handler';
import { FindMenuCategoryTlQueryHandler } from './application/query/find-menu-cetegory-tl.query.handler';
import { UpdateMenuCategoryTlCommandHandler } from './application/command/update-menu-category-tl.command.handler';
import { FindMenuOptionCategoryTlQueryHandler } from './application/query/find-menu-option-cetegory-tl.query.handler';
import { UpdateMenuOptionCategoryTlCommandHandler } from './application/command/update-menu-option-category-tl.command.handler';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.MENU_REPOSITORY,
    useClass: MenuRepositoryImplement
  },
  {
    provide: InjectionToken.MENU_QUERY,
    useClass: MenuQueryImplement
  },
  {
    provide: InjectionToken.MENUCATEGORY_REPOSITORY,
    useClass: MenuCategoryRepositoryImplement
  },
  {
    provide: InjectionToken.MENUCATEGORY_QUERY,
    useClass: MenuCategoryQueryImplement
  },
  {
    provide: InjectionToken.IMAGE_REPOSITORY,
    useClass: ImageRepositoryImplement
  },
  {
    provide: InjectionToken.MENU_FACTOEY,
    useClass: MenuFactory
  },
  {
    provide: InjectionToken.MENU_CATEGORY_FACTORY,
    useClass: MenuCategoryFactory
  },
  {
    provide: InjectionToken.IMAGE_FACTORY,
    useClass: ImageFactory
  }
];

const domain = [
  MenuDomainService,
  MenuFactory,
  MenuCategoryFactory,
  ImageFactory
];

const application = [
  CreateMenuCategoryCommandHandler,
  CreateMenuCommandHandler,
  DeleteMenuCategoryCommandHandler,
  DeleteMenuCommandHandler,
  UpdateMenuCategoryCommandHandler,
  UpdateMenuCommandHandler,
  FindAllMenuCategoryQueryHandler,
  FindAllMenuQueryHandler,
  FindMenuCategoryQueryHandler,
  FindMenuQueryHandler,
  FindAllUserMenuQueryHandler,
  UploadMenuImageCommandHandler,
  UpdateMenuCategoryEventHandler,
  UpdateMenuEventHandler,
  DeleteMenuEventHandler,
  DeleteMenuCategoryEventHandler,
  UpdateMenuCategoryIndexCommandHandler,
  UpdateMenuCategoryIndexEventHandler,
  UpdateMenuIndexCommandHandler,
  UpdateMenuIndexEventEventHandler,
  FindMenuTlQueryHandler,
  UpdateMenuTlCommandHandler,
  FindMenuOptionTlQueryHandler,
  UpdateMenuOptionTlCommandHandler,
  FindMenuCategoryTlQueryHandler,
  UpdateMenuCategoryTlCommandHandler,
  FindMenuOptionCategoryTlQueryHandler,
  UpdateMenuOptionCategoryTlCommandHandler
];

@Module({
  imports: [
    CqrsModule,
    AuthModule,
    CacheStoreModule,
    ValidationModule,
    TranslateModule
  ],
  controllers: [MenuController],
  providers: [...application, ...infrastructure, ...domain],
  exports: [...infrastructure]
})
export class MenuModule {}
