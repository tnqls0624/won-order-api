import { Global, Module } from '@nestjs/common';
import { v4 } from 'uuid';
import prisma from './infra/prisma-client';

export class EntityId extends String {
  constructor() {
    super(v4().split('-').join(''));
  }
}

@Global()
@Module({
  providers: [
    {
      provide: 'PRISMA_CLIENT',
      useValue: prisma
    }
  ],
  exports: ['PRISMA_CLIENT']
})
export class PrismaModule {}
