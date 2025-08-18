export interface TranslatorService {
  translate(
    inputPath: string,
    outputPath: string,
    sourceLang: string | null,
    targetLang: string,
    originalFilename: string
  ): Promise<void>;
}
