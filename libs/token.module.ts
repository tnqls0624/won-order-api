import { Module } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

export interface TokenGenerator {
  generateToken: (alphabet: string, length: number) => string;
}

class TokenGeneratorImplement implements TokenGenerator {
  generateToken(alphabet: string, length: number): string {
    const nanoid = customAlphabet(alphabet, length)();
    return nanoid;
  }
}

export const TOKEN_GENERATOR = 'TOKEN_GENERATOR';

@Module({
  providers: [
    {
      provide: TOKEN_GENERATOR,
      useClass: TokenGeneratorImplement
    }
  ],
  exports: [TOKEN_GENERATOR]
})
export class TokenModule {}
