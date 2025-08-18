import { DownloadedFile, StorageProvider, StorageUploadParams } from '../../../application/providers/storage-provider';
import { gcsClient, bucketName } from '../../lib/gcsClient';
import { Bucket } from '@google-cloud/storage';
import { randomUUID } from 'crypto';

export class GCSStorageProvider implements StorageProvider {
  private bucket: Bucket;

  constructor() {
    this.bucket = gcsClient.bucket(bucketName);
  }

  async upload(file: StorageUploadParams): Promise<{ key: string }> {
    const fileExtension = file.originalname.split('.').pop();
    const fileKey = `${randomUUID()}.${fileExtension}`;

    const blob = this.bucket.file(fileKey);

    await blob.save(file.buffer, {
      contentType: file.mimetype,
      resumable: false
    });

    console.log(`Arquivo ${fileKey} enviado para o GCS.`);

    return { key: fileKey };
  }

  async download(key: string): Promise<DownloadedFile> {
    const fileReference = this.bucket.file(key);

    const [buffer, metadata] = await Promise.all([
      fileReference.download().then(data => data[0]),
      fileReference.getMetadata().then(data => data[0])
    ]);

    return {
      buffer,
      mimetype: metadata.contentType || 'application/octet-stream',
      originalname: metadata.metadata?.originalname?.toString() || key, 
    };
  }

  async getFileToTranslate(key: string): Promise<Buffer> {
    const [buffer] = await this.bucket.file(key).download();
    return buffer;
  }
}