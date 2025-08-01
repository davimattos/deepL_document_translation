import { SourceLanguageCode, TargetLanguageCode, Translator } from "deepl-node";
import fs from "fs";
import { ITranslatorService } from "../../domain/translator-service";

export class DeeplTranslatorAdapter implements ITranslatorService {
  private translator: Translator;

  constructor(apiKey: string) {
    this.translator = new Translator(apiKey);
  }

  async translateDocument(
    inputPath: string,
    outputPath: string,
    sourceLang: SourceLanguageCode | null,
    targetLang: TargetLanguageCode,
    originalFilename: string,
  ): Promise<void> {
    try {
      await this.translator.translateDocument(
        fs.createReadStream(inputPath),
        outputPath,
        sourceLang,
        targetLang,
        { filename: originalFilename },
      );
    } catch (error: any) {
      console.error("DeepL translation error:", error);
      throw new Error("Translation failed: " + error.message);
    }
  }
}
