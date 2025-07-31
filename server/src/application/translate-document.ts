import { ITranslatorService } from "../domain/translator-service";
import { IDocumentStorage } from "../domain/document-storage";
import { Document } from "../domain/document";

export class TranslateDocument {
  constructor(
    private translator: ITranslatorService,
    private storage: IDocumentStorage
  ) {}

  async execute(input: {
    document: Document;
    sourceLang: string;
    targetLang: string;
  }) {
    const { document, sourceLang, targetLang } = input;

    const timestamp = Date.now();
    const extension = document.getExtension();
    const baseName = document.getBaseName();
    const outputFilename = `translated_${baseName}_${timestamp}.${extension}`;

    const outputPath = this.storage.getDownloadPath(outputFilename);

    await this.translator.translateDocument(
      document.tempPath,
      outputPath,
      sourceLang === 'auto' ? null : sourceLang,
      targetLang,
      document.originalName
    );

    this.storage.deleteTempFile(document.tempPath);
    console.log('Deleted uploaded file:', document.tempPath);

    return {
      success: true,
      message: "Document translated",
      downloadUrl: `/api/downloads/${outputFilename}`,
      filename: outputFilename,
      originalFilename: document.originalName,
    };
  }
}
