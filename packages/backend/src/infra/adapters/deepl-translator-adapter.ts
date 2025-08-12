import { SourceLanguageCode, TargetLanguageCode, Translator } from "deepl-node";
import fs from "fs";
import { TranslatorService } from "../../domain/translator-service";

export class DeeplTranslatorAdapter implements TranslatorService {
  private translator: Translator;

  constructor(apiKey: string) {
     if (!apiKey) {
      throw new Error("A chave da API do DeepL não foi fornecida ao adaptador.");
    }
    
    this.translator = new Translator(apiKey);
  }

  async translate(
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
