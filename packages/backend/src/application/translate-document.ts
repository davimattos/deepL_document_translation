import { TranslatorService } from "../domain/translator-service";
import { StorageProvider } from "./providers/storage-provider";

import { randomUUID } from "crypto";
import * as fs from "fs/promises";
import * as path from "path";
import { fileTypeFromBuffer } from 'file-type';

interface ExecuteParams {
  fileKey: string;
  originalFilename: string;
  sourceLang: string | null;
  targetLang: string;
}

export class TranslateDocument {
  constructor(
    private translator: TranslatorService,
    private storage: StorageProvider,
  ) {}

  async execute({ fileKey, originalFilename, sourceLang, targetLang }: ExecuteParams) {
    const tempDir = path.join(__dirname, "..", "..", "tmp", randomUUID());
    const inputPath = path.join(tempDir, originalFilename);
    const outputPath = path.join(tempDir, `translated-${originalFilename}`);

    try {
      await fs.mkdir(tempDir, { recursive: true });

      const originalFileBuffer = await this.storage.getFileToTranslate(fileKey);
      await fs.writeFile(inputPath, originalFileBuffer);

      await this.translator.translate(
        inputPath,
        outputPath,
        sourceLang === "auto" ? null : sourceLang,
        targetLang,
        originalFilename,
      );

      const translatedFileBuffer = await fs.readFile(outputPath);

      const fileType = await fileTypeFromBuffer(translatedFileBuffer);
      const mimeType = fileType?.mime || 'application/octet-stream';


      const { key: translatedFileKey } = await this.storage.upload({
        buffer: translatedFileBuffer,
        mimetype: mimeType,
        originalname: `translated-${originalFilename}`,
        size: translatedFileBuffer.length
      });

      return {
        success: true,
        message: "Document translated",
        downloadUrl: translatedFileKey,
        filename: `translated-${originalFilename}`,
        originalFilename,
      };
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  }
}
