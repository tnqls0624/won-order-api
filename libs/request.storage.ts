import { InternalServerErrorException } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { EntityId } from 'src/prisma/prisma.module';

class Storage {
  constructor(readonly request_id = new EntityId().toString()) {}
}

interface RequestStorage {
  reset: () => void;
  setRequestId: (request_id: string) => void;
}

class RequestStorageImplement implements RequestStorage {
  private readonly storage = new AsyncLocalStorage<Storage>();

  reset(): void {
    this.storage.enterWith(new Storage());
  }

  setRequestId(request_id: string): void {
    const storage = this.getStorage();
    this.storage.enterWith({ ...storage, request_id });
  }

  getStorage(): Storage {
    const storage = this.storage.getStore();
    if (!storage)
      throw new InternalServerErrorException('RequestStorage is not found');
    return storage;
  }
}

export const RequestStorage = new RequestStorageImplement();
