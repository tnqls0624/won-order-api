import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MenuCategoryFactory } from 'src/menu/domain/menu-category.factory';
import { AdminType } from 'src/types/login.type';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { InjectionToken } from '../Injection-token';
import { CreateMenuCommandHandler } from './create-menu.command.handler';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { MenuFactory } from 'src/menu/domain/menu.factory';
import { CreateMenuCommand } from './create-menu.command';
import { CreateMenuDto } from 'src/menu/interface/dto/create-menu.dto';
import { MenuOptionCategoryType } from 'src/menu/infrastructure/entity/menu-option-category.entity';
import { CacheStoreModule } from 'src/cache/cache.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { MenuStatus } from 'src/menu/infrastructure/entity/menu.entity';

describe('CreateMenuCommandHandler', () => {
  let handler: CreateMenuCommandHandler;
  let repository: MenuRepository;
  let factory: MenuCategoryFactory;

  beforeEach(async () => {
    const repo_provider: Provider = {
      provide: InjectionToken.MENU_REPOSITORY,
      useValue: {}
    };

    const factory_provider: Provider = {
      provide: MenuFactory,
      useValue: {}
    };

    const providers: Provider[] = [
      CreateMenuCommandHandler,
      repo_provider,
      factory_provider
    ];

    const module_metadata: ModuleMetadata = {
      imports: [
        CacheModule.registerAsync({
          isGlobal: true,
          extraProviders: [],
          useFactory: async (): Promise<any> => ({
            store: redisStore,
            host: '3.37.217.0',
            port: '6379'
          })
        }),
        CacheStoreModule
      ],
      providers
    };
    const testModule =
      await Test.createTestingModule(module_metadata).compile();
    factory = testModule.get(MenuFactory);
    handler = testModule.get(CreateMenuCommandHandler);
    repository = testModule.get(InjectionToken.MENU_REPOSITORY);
  });

  describe('execute', () => {
    it('should execute CreateMenuCommand', async () => {
      const menu = CreateMenuDto.of({
        menu_category_id: 1,
        status: MenuStatus.BLIND,
        name: '수무무',
        content: '수무무입니다',
        amount: 1000,
        is_active: false,
        image_ids: [1, 2, 3],
        menu_option_category: [
          {
            index: 1,
            type: MenuOptionCategoryType.REQUIRE,
            name: '수무무 상체',
            menu_option: [
              {
                name: '수무무 목',
                amount: 1000
              }
            ],
            max_select_count: 1
          }
        ]
      });
      const admin_dto = AdminDto.of(
        1,
        1,
        1,
        AdminType.MASTER,
        'admin',
        '어드민'
      );
      factory.create = jest.fn().mockReturnValue(menu);
      repository.save = jest.fn().mockResolvedValue(undefined);
      const command = new CreateMenuCommand(admin_dto, menu);

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(menu);
    });
  });
});
