import { ITranslatorService } from '../domain/translator-service';
import { Document } from '../domain/document';
import { FileManager } from '../infrastructure/file-manager';
import path from 'path';

export class TranslateDocumentUseCase {
  constructor(
    private translator: ITranslatorService,
    private fileManager: FileManager
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
    const outputPath = path.join(this.fileManager.downloadsDir, outputFilename);

    await this.translator.translateDocument(
      document.tempPath,
      outputPath,
      sourceLang === 'auto' ? null : sourceLang,
      targetLang,
      document.originalName
    );

    this.fileManager.deleteFile(document.tempPath);

    return {
      success: true,
      message: 'Document translated',
      downloadUrl: `/api/downloads/${outputFilename}`,
      filename: outputFilename,
      originalFilename: document.originalName
    };
  }
}
