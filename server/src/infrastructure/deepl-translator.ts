import { SourceLanguageCode, TargetLanguageCode, Translator } from 'deepl-node';
import { ITranslatorService } from '../domain/translator-service';
import fs from 'fs';

export class DeeplTranslatorService implements ITranslatorService {
  private translator: Translator;

  constructor(apiKey: string) {
    this.translator = new Translator(apiKey);
  }

  async translateDocument(
    inputPath: string,
    outputPath: string,
    sourceLang: SourceLanguageCode | null,
    targetLang: TargetLanguageCode,
    originalFilename: string
  ) {
    await this.translator.translateDocument(
      fs.createReadStream(inputPath),
      outputPath,
      sourceLang,
      targetLang,
      { filename: originalFilename }
    );
  }
}
