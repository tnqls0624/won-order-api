import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdminType } from 'src/types/login.type';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { InjectionToken } from '../Injection-token';
import { MenuRepository } from 'src/menu/domain/menu.repository';
import { DeleteMenuCommandHandler } from './delete-menu.command.handler';
import { DeleteMenuCommand } from './delete-menu.command';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from 'src/auth/auth.module';
import CustomError from 'src/common/error/custom-error';

describe('DeleteMenuCommandHandler', () => {
  let handler: DeleteMenuCommandHandler;
  let repository: MenuRepository;

  beforeEach(async () => {
    const repo_provider: Provider = {
      provide: InjectionToken.MENU_REPOSITORY,
      useValue: {}
    };

    const providers: Provider[] = [DeleteMenuCommandHandler, repo_provider];

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
        AuthModule
      ],
      providers
    };
    const testModule =
      await Test.createTestingModule(module_metadata).compile();
    handler = testModule.get(DeleteMenuCommandHandler);
    repository = testModule.get(InjectionToken.MENU_REPOSITORY);
  });

  describe('execute', () => {
    it('should throw NotFoundException when menu not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);
      const admin_dto = AdminDto.of(1, 1, AdminType.MASTER, 'admin', '어드민');
      const command = new DeleteMenuCommand(admin_dto, 0);

      await expect(handler.execute(command)).rejects.toThrowError(CustomError);

      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
    });

    it('should execute DeleteMenuCommand', async () => {
      const menu = { findById: jest.fn(), delete: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue(menu);
      const admin_dto = AdminDto.of(1, 1, AdminType.MASTER, 'admin', '어드민');
      const command = new DeleteMenuCommand(admin_dto, 1);

      await expect(handler.execute(command)).resolves.toEqual(true);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(menu.delete).toBeCalledTimes(1);
      expect(menu.delete).toBeCalledWith();
    });
  });
});
