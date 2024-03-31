import { Translate } from '@google-cloud/translate/build/src/v2';
import { Inject, Injectable, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TranslateGeneratorImplement implements TranslateGenerator {
  gcp: Translate;

  constructor(@Inject('PRISMA_CLIENT') private prisma: PrismaClient) {
    this.gcp = new Translate({
      projectId: process.env.GOOGLE_PROJECT_ID,
      key: process.env.GOOGLE_KEY
    });
  }
  async gcpTranslate(
    word: string,
    market_id: number
  ): Promise<{ [key: string]: string }[]> {
    const languages = await this.prisma.language
      .findMany({
        where: {}
      })
      .then((langs) =>
        langs.map((v) => {
          return {
            id: v.id,
            code: v.code
          };
        })
      );
    const market_lang_code =
      await this.getCurrentSettingLanguageCode(market_id);
    const translate_word = await Promise.all(
      languages.map(async (lang) => {
        if (lang.code === market_lang_code) {
          return { [lang.id]: word };
        } else {
          const [translations] = await this.gcp.translate(word, lang.code);
          return { [lang.id]: translations };
        }
      })
    );
    return translate_word;
  }

  isEnglishText(text: string) {
    return /^[A-Za-z]+$/.test(text);
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  async getCurrentSettingLanguageCode(market_id: number): Promise<string> {
    const market = await this.prisma.market.findFirst({
      where: { id: market_id },
      include: {
        language: true
      }
    });
    return market?.language?.code || '';
  }
}

export interface TranslateGenerator {
  gcpTranslate: (
    word: string,
    market_id: number
  ) => Promise<{ [key: string]: string }[]>;
  isEnglishText: (word: string) => boolean;
  capitalizeFirstLetter: (word: string) => string;
}

export const TRANSLATE_GENERATOR = 'TRANSLATE_GENERATOR';

@Module({
  providers: [
    {
      provide: TRANSLATE_GENERATOR,
      useClass: TranslateGeneratorImplement
    }
  ],
  exports: [TRANSLATE_GENERATOR]
})
export class TranslateModule {}
