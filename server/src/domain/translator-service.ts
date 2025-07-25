export interface ITranslatorService {
  translateDocument(
    inputPath: string,
    outputPath: string,
    sourceLang: string | null,
    targetLang: string,
    originalFilename: string
  ): Promise<void>;
}
