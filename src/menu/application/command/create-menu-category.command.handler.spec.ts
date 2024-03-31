import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MenuCategoryRepository } from 'src/menu/domain/menu-category.repository';
import { MenuCategoryFactory } from 'src/menu/domain/menu-category.factory';
import {
  CreateMenuCategoryDto,
  MenuCategoryStatus
} from 'src/menu/interface/dto/create-menu-category.dto';
import { AdminType } from 'src/types/login.type';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { InjectionToken } from '../Injection-token';
import { CreateMenuCategoryCommand } from './create-menu-category.command';
import { CreateMenuCategoryCommandHandler } from './create-menu-category.command.handler';

describe('CreateMenuCategoryCommandHandler', () => {
  let handler: CreateMenuCategoryCommandHandler;
  let repository: MenuCategoryRepository;
  let factory: MenuCategoryFactory;

  beforeEach(async () => {
    const repo_provider: Provider = {
      provide: InjectionToken.MENUCATEGORY_REPOSITORY,
      useValue: {}
    };

    const factory_provider: Provider = {
      provide: MenuCategoryFactory,
      useValue: {}
    };

    const providers: Provider[] = [
      CreateMenuCategoryCommandHandler,
      repo_provider,
      factory_provider
    ];

    const module_metadata: ModuleMetadata = {
      providers
    };
    const testModule =
      await Test.createTestingModule(module_metadata).compile();
    factory = testModule.get(MenuCategoryFactory);
    handler = testModule.get(CreateMenuCategoryCommandHandler);
    repository = testModule.get(InjectionToken.MENUCATEGORY_REPOSITORY);
  });

  describe('execute', () => {
    it('should execute CreateMenuCategoryCommand', async () => {
      const menu_category = CreateMenuCategoryDto.of(
        1,
        MenuCategoryStatus.FOR_SALE,
        '테스트 카테고리',
        '테스트입니다'
      );
      const admin_dto = AdminDto.of(1, 1, AdminType.MASTER, 'admin', '어드민');
      factory.create = jest.fn().mockReturnValue(menu_category);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new CreateMenuCategoryCommand(admin_dto, menu_category);

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(1, 1, menu_category);
    });
  });
});
