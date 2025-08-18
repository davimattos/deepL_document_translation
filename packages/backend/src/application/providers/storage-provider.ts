export interface File {
  originalname: string;
  mimetype: string;
  tempPath: string;
  size: number;
}

export interface StorageUploadParams {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface DownloadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export interface StorageProvider {
  upload(file: StorageUploadParams): Promise<{ key: string }>;
  getFileToTranslate(key: string): Promise<Buffer>;
  download(key: string): Promise<DownloadedFile>;
}