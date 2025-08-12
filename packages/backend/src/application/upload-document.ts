
import * as fs from 'fs/promises';
import { StorageProvider, File } from '../application/providers/storage-provider';

export class UploadDocument {
  constructor(private storageProvider: StorageProvider) {}

  async execute(file: File): Promise<{ fileKey: string }> {

    try {
      const fileBuffer = await fs.readFile(file.tempPath);

      const { key } = await this.storageProvider.upload({
        originalname: file.originalname,
        mimetype: file.mimetype,
        buffer: fileBuffer,
        size: file.size,
      });

      return { fileKey: key };
    } finally {
      await fs.unlink(file.tempPath);
    }
  }
}