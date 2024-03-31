import { Module } from '@nestjs/common';
import bcrypt from 'bcrypt';

export interface PasswordGenerator {
  generateHash: (password: string) => Promise<string>;
}

class PasswordGeneratorImplement implements PasswordGenerator {
  async generateHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 12);
    return hash;
  }
}

export const PASSWORD_GENERATOR = 'PASSWORD_GENERATOR';

@Module({
  providers: [
    {
      provide: PASSWORD_GENERATOR,
      useClass: PasswordGeneratorImplement
    }
  ],
  exports: [PASSWORD_GENERATOR]
})
export class PasswordModule {}
